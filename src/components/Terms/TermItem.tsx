import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVotes } from "../../services/termService";
import DownvoteIcon from "./DownvoteIcon";
import UpvoteIcon from "./UpvoteIcon";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Term } from "../../models/termModel";

interface TermItemProps {
    term: Term;
    user: any;
    handleUpvote: (termId: string) => void;
    handleDownvote: (termId: string) => void;
    handleBookmark: (termId: string) => void;
    handleUnbookmark: (termId: string) => void;
}

const TermItem: React.FC<TermItemProps> = ({ term, user, handleUpvote, handleDownvote, handleBookmark, handleUnbookmark }) => {
    const [votes, setVotes] = useState<{ upvotes: number; downvotes: number }>({ upvotes: 0, downvotes: 0 });
    const [userHasUpvoted, setUserHasUpvoted] = useState(term.upvotedBy.includes(user?._id));
    const [userHasDownvoted, setUserHasDownvoted] = useState(term.downvotedBy.includes(user?._id));
    const [userHasBookmarked, setUserHasBookmarked] = useState(term.bookmarkedBy.includes(user?._id));

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
        <li className="flex flex-col justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] transition-transform transform hover:scale-105">
            <div>
                <Link to={`/terms/${term._id}`}>
                    <h3 className="text-xl font-bold text-gray-800">{term.term}</h3>
                    <p className="text-gray-600">{term.translation}</p>
                    <p className="text-gray-800">{term.definition}</p>
                    {term.language && (
                        <p className="text-gray-800">Language {term.language.name} ({term.language.code})</p>
                    )}
                </Link>
            </div>
            <div>
                <div className="mt-2">
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full mr-2">
                        {term.grammaticalCategory.name}
                    </span>
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                        {term.theme.name}
                    </span>
                </div>
                {user && (
                    <div className="mt-4 flex items-center space-x-4 ">
                        <button
                            onClick={handleBookmarkClick}
                            className={`flex justify-center items-center justify-self-start w-10 h-10 rounded-full hover:text-yellow-600 bg-gray-100 hover:bg-yellow-100 focus:outline-none transition duration-200 ${userHasBookmarked ? 'text-yellow-600' : 'text-gray-300'} shadow-neumorphic hover:shadow-neumorphic-inset`}
                            style={{ order: -1 }}
                        >
                            {userHasBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </button>
                        <div className="flex items-center space-x-2 justify-end w-full"><span className="text-green-600">{votes.upvotes}</span>
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
                            <span className="text-red-600">{votes.downvotes}</span></div>


                    </div>
                )}
            </div>
        </li>
    );
};

export default TermItem;
