import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVotes } from "../../services/termService";
import DownvoteIcon from "./DownvoteIcon";
import UpvoteIcon from "./UpvoteIcon";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Term } from "../../models/termModel";
import { User } from "../../models/userModel";
import Avatar from '@mui/material/Avatar';

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
    const [userHasUpvoted, setUserHasUpvoted] = useState(user ? term.upvotedBy.includes(user._id) : false);
    const [userHasDownvoted, setUserHasDownvoted] = useState(user ? term.downvotedBy.includes(user._id) : false);
    const [userHasBookmarked, setUserHasBookmarked] = useState(user ? term.bookmarkedBy.includes(user._id) : false);

    const MAX_DEFINITION_LENGTH = 100;

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

    const truncateDefinition = (definition: string) => {
        if (definition.length > MAX_DEFINITION_LENGTH) {
            return definition.substring(0, MAX_DEFINITION_LENGTH) + "...";
        }
        return definition;
    };

    return (
        <li className="flex flex-col justify-between mb-4 p-4 bg-background rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 min-h-[300px]">
            <div className="flex items-center mb-4">
                <Avatar alt={term.author.username} className="mr-1" />
                <Link to={`/profile/${term.author.username}`} className="text-primary hover:underline">
                    <h4 className="font-semibold text-text">{term.author.username}</h4>
                </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between  mb-4">
                <div className="">
                    <Link to={`/terms/${term._id}`}>
                        <h3 className="text-xl font-bold text-text">{term.term}</h3>
                        <p className="text-accent font-bold">{term.translation}</p>
                        <p className="text-text">{truncateDefinition(term.definition)}</p>
                    </Link>
                </div>
                {term.language && (
                    <div >
                        <span className="bg-accentLight text-accent font-bold text-xs px-2 rounded-full">
                            {term.language.name} ({term.language.code})
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-end">
                <div className="flex items-center font-bold">
                    <span className="inline-block bg-primaryLight text-primary text-xs px-2 rounded-full mr-2">
                        {term.grammaticalCategory.name}
                    </span>
                    <span className="inline-block bg-secondaryLight text-secondary text-xs px-2 rounded-full">
                        {term.theme.name}
                    </span>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBookmarkClick}
                            className={`flex justify-center items-center w-10 h-10 rounded-full focus:outline-none transition duration-200 ${userHasBookmarked ? 'text-warning' : 'text-text'} hover:bg-warningHover hover:text-warning shadow-neumorphic`}
                        >
                            {userHasBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </button>
                        <div className="flex items-center space-x-2">
                            <span className="text-success">{votes.upvotes}</span>
                            <button
                                onClick={handleUpvoteClick}
                                className={`flex justify-center items-center w-10 h-10 rounded-full focus:outline-none transition duration-200 ${userHasUpvoted ? 'text-success' : 'text-text'} hover:bg-successHover hover:text-success shadow-neumorphic`}
                            >
                                <UpvoteIcon isUpvoted={userHasUpvoted} />
                            </button>
                            <button
                                onClick={handleDownvoteClick}
                                className={`flex justify-center items-center w-10 h-10 rounded-full focus:outline-none transition duration-200 ${userHasDownvoted ? 'text-error' : 'text-text'} hover:bg-errorHover hover:text-error shadow-neumorphic`}
                            >
                                <DownvoteIcon isDownvoted={userHasDownvoted} />
                            </button>
                            <span className="text-error">{votes.downvotes}</span>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

export default TermItem;
