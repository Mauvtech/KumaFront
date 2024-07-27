import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVotes } from "../../services/termService";
import DownvoteIcon from "./DownvoteIcon";
import UpvoteIcon from "./UpvoteIcon";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Term } from "../../models/termModel";
import { User } from "../../models/userModel";
import Avatar from '@mui/material/Avatar'; // Importation de l'avatar de Material-UI

interface TermItemProps {
    term: Term;
    user: User | null;
    handleUpvote: (termId: string) => void;
    handleDownvote: (termId: string) => void;
    handleBookmark: (termId: string) => void;
    handleUnbookmark: (termId: string) => void;
}

const TermItem: React.FC<TermItemProps> = ({ term, user, handleUpvote, handleDownvote, handleBookmark, handleUnbookmark }) => {
    const [votes, setVotes] = useState<{ upvotes: number; downvotes: number }>({ upvotes: 0, downvotes: 0 });
    const [userHasUpvoted, setUserHasUpvoted] = useState(user ? term.upvotedBy.includes(user!._id) : false);
    const [userHasDownvoted, setUserHasDownvoted] = useState(user ? term.downvotedBy.includes(user!._id) : false);
    const [userHasBookmarked, setUserHasBookmarked] = useState(user ? term.bookmarkedBy.includes(user!._id) : false);

    useEffect(() => {
        const fetchVotes = async () => {
            const data = await getVotes(term._id);
            if (data) {
                setVotes(data);
            }
        };
        fetchVotes();
    }, [term._id]);

    const handleUpvoteClick = () => {
        handleUpvote(term._id);
        if (userHasUpvoted) {
            setVotes(prevVotes => ({ ...prevVotes, upvotes: prevVotes.upvotes - 1 }));
        } else {
            setVotes(prevVotes => ({ ...prevVotes, upvotes: prevVotes.upvotes + 1, downvotes: userHasDownvoted ? prevVotes.downvotes - 1 : prevVotes.downvotes }));
            setUserHasDownvoted(false);
        }
        setUserHasUpvoted(!userHasUpvoted);
    };

    const handleDownvoteClick = () => {
        handleDownvote(term._id);
        if (userHasDownvoted) {
            setVotes(prevVotes => ({ ...prevVotes, downvotes: prevVotes.downvotes - 1 }));
        } else {
            setVotes(prevVotes => ({ ...prevVotes, downvotes: prevVotes.downvotes + 1, upvotes: userHasUpvoted ? prevVotes.upvotes - 1 : prevVotes.upvotes }));
            setUserHasUpvoted(false);
        }
        setUserHasDownvoted(!userHasDownvoted);
    };

    const handleBookmarkClick = () => {
        if (userHasBookmarked) {
            handleUnbookmark(term._id);
            setUserHasBookmarked(false);
        } else {
            handleBookmark(term._id);
            setUserHasBookmarked(true);
        }
    };

    return (
        <li className="flex flex-col justify-between mb-4 p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
                <Avatar alt={term.author.username} className="mr-3" />
                <Link to={`/profile/${term.author.username}`} className="text-blue-500 hover:underline">
                    <h4 className="font-semibold">{term.author.username}</h4>
                </Link>
            </div>
            <div className="mb-4">
                <Link to={`/terms/${term._id}`}>
                    <h3 className="text-xl font-bold text-gray-800">{term.term}</h3>
                    <p className="text-gray-600">{term.translation}</p>
                    <p className="text-gray-800">{term.definition}</p>
                    {term.language && (
                        <p className="text-gray-800">Language {term.language.name} ({term.language.code})</p>
                    )}
                </Link>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full mr-2">
                        {term.grammaticalCategory.name}
                    </span>
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                        {term.theme.name}
                    </span>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBookmarkClick}
                            className={`flex justify-center items-center w-10 h-10 rounded-full hover:text-yellow-600 bg-gray-100 hover:bg-yellow-100 focus:outline-none transition duration-200 ${userHasBookmarked ? 'text-yellow-600' : 'text-gray-300'} shadow-neumorphic hover:shadow-neumorphic-inset`}
                        >
                            {userHasBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </button>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">{votes.upvotes}</span>
                            <button
                                onClick={handleUpvoteClick}
                                className={`flex justify-center items-center w-10 h-10 rounded-full hover:text-green-600 bg-gray-100 hover:bg-green-100 focus:outline-none transition duration-200 ${userHasUpvoted ? 'text-green-600' : 'text-gray-300'} shadow-neumorphic hover:shadow-neumorphic-inset`}
                            >
                                <UpvoteIcon isUpvoted={userHasUpvoted} />
                            </button>
                            <button
                                onClick={handleDownvoteClick}
                                className={`flex justify-center items-center w-10 h-10 rounded-full hover:text-red-600 bg-gray-100 hover:bg-red-100 focus:outline-none transition duration-200 ${userHasDownvoted ? 'text-red-600' : 'text-gray-300'} shadow-neumorphic hover:shadow-neumorphic-inset`}
                            >
                                <DownvoteIcon isDownvoted={userHasDownvoted} />
                            </button>
                            <span className="text-red-600">{votes.downvotes}</span>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

export default TermItem;
