import React from "react";
import {Link} from "react-router-dom";
import DownvoteIcon from "./DownvoteIcon";
import UpvoteIcon from "./UpvoteIcon";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Avatar from "@mui/material/Avatar";
import useTerms from "../../services/term/termMutationService";
import {useAuth} from "../../contexts/authContext";
import {Term} from "../../services/term/termModel";
import clsx from "clsx";

interface TermItemProps {
    term: Term;
    termUserData?: {
        hasUpvoted: boolean;
        hasDownvoted: boolean;
        hasBookmarked: boolean;
    };
    isFeed: boolean;
}

export default function TermCard({
                                     term,
                                     termUserData,
                                     isFeed,
                                 }: TermItemProps) {

    const {saveMutation} = useTerms();

    const {user}
        = useAuth();

    const {mutate} = saveMutation();

    const handleDownvote = (id: number) => {
        mutate({id, request: {upvote: false}});
    };


    const handleBookmark = () => {
        const id = term.id;
        mutate({id, request: {bookmark: true}});
    };

    const handleUnbookmark = (id: number) => {
        mutate({id, request: {bookmark: false}});
    };

    const handleUpvoteClick = () => {
        const id = term.id
        mutate({id, request: {upvote: true}});
    };

    const handleDownvoteClick = () => {
        handleDownvote(term.id);
    };

    const truncateDefinition = (definition: string) => {
        const MAX_DEFINITION_LENGTH = 150;
        if (definition.length > MAX_DEFINITION_LENGTH) {
            return definition.substring(0, MAX_DEFINITION_LENGTH) + "...";
        }
        return definition;
    };

    const formatLabel = (label: string) => {
        const words = label.split(" ");
        if (words.length > 1 && !words[1].startsWith("(")) {
            return `${words[0]} ${words[1][0].toUpperCase()}.`;
        }
        return label;
    };

    const containerClasses = isFeed
        ? "p-6 bg-background rounded-lg shadow-md  transition-transform transform hover:scale-105 w-full md:w-[48%] lg:w-full xl:w-full h-[60vh] h-fit m-2 mx-auto overflow-hidden"
        : "p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 w-full sm:w-[70%] md:w-[50%] lg:w-full mx-auto overflow-hidden";

    const avatarClasses = isFeed ? "mr-4 w-16 h-16 md:w-20 md:h-20" : "mr-2 w-10 h-10";

    const textClasses = isFeed ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg";

    // Define size of buttons and icons based on isFeed and screen size
    const buttonSizeClasses = isFeed
        ? "w-8 h-8 md:w-16 md:h-16" // Larger on bigger screens
        : "w-8 h-8"; // Smaller on mobile or when not in feed

    const iconStyle = {
        fontSize: isFeed ? (window.innerWidth < 768 ? "20px" : "40px") : "20px",
    };

    const labelClasses = isFeed
        ? "text-sm md:text-base px-3 py-1"
        : "text-xs px-2 py-0.5";


    return (
        <li className={clsx("flex flex-col justify-between mb-4", containerClasses)}>
            <div className="flex items-center mb-4">
                <Avatar alt={term.author.username} className={avatarClasses}/>
                <Link to={`/profile/${term.author.username}`} className="text-primary hover:underline truncate">
                    <h4 className={`font-semibold ${textClasses} text-text`}>{term.author.username}</h4>
                </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between mb-4 overflow-hidden">
                <div>
                    <Link to={`/terms/${term.id}`}>
                        <h3 className={`font-bold ${textClasses} text-text mb-2 truncate`}>{term.name}</h3>
                        <p className={`text-accent font-bold ${textClasses} mb-2 truncate`}>{term.translation}</p>
                        <p className={`${textClasses} text-text truncate`}>{truncateDefinition(term.definition)}</p>
                    </Link>
                </div>
                {term.language && (
                    <div className="mt-2">
                        <span
                            className={`bg-accentLight text-accent font-bold ${labelClasses} rounded-full truncate`}
                        >
                            {formatLabel(`${term.language.name} (${term.language.code})`)}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center font-bold">
                    <span
                        className={`inline-block bg-primary-light text-primary ${labelClasses} rounded-full mr-2 truncate`}
                    >
                        {formatLabel(term.grammaticalCategory.name)}
                    </span>
                    <span
                        className={`inline-block bg-secondary-light text-secondary ${labelClasses} rounded-full truncate`}
                    >
                        {formatLabel(term.tags.join())}
                    </span>
                </div>
                {termUserData && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleBookmark}
                            className={`flex justify-center items-center ${buttonSizeClasses} rounded-full focus:outline-none transition duration-200 ${termUserData.hasBookmarked ? "text-warning" : "text-primary"
                            } hover:bg-warningHover hover:text-warning shadow-neumorphic`}
                        >
                            {termUserData.hasBookmarked ? (
                                <BookmarkIcon style={iconStyle}/>
                            ) : (
                                <BookmarkBorderIcon style={iconStyle}/>
                            )}
                        </button>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleUpvoteClick}
                                className={`flex justify-center items-center ${buttonSizeClasses} rounded-full focus:outline-none transition duration-200 ${termUserData.hasUpvoted ? "text-success" : "text-primary"
                                } hover:bg-successHover hover:text-success shadow-neumorphic`}
                            >
                                <UpvoteIcon isUpvoted={termUserData.hasUpvoted} isFeed={isFeed}/>
                            </button>
                            {
                                term.voteCount > 0 ?
                                    <span className={`${textClasses} text-success`}>{term.voteCount}</span> :
                                    <span className={`${textClasses} text-error`}>{term.voteCount}</span>
                            }
                            <button
                                onClick={handleDownvoteClick}
                                className={`flex justify-center items-center ${buttonSizeClasses} rounded-full focus:outline-none transition duration-200 ${!termUserData.hasDownvoted ? "text-error" : "text-primary"
                                } hover:bg-errorHover hover:text-error shadow-neumorphic`}
                            >
                                <DownvoteIcon isDownvoted={termUserData.hasDownvoted} isFeed={isFeed}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};