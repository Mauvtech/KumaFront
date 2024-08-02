import React from "react";

interface UpvoteIconProps {
    isUpvoted: boolean;
    isFeed: boolean;
}

const UpvoteIcon: React.FC<UpvoteIconProps> = ({ isUpvoted, isFeed }) => {
    const sizeClasses = isFeed ? "md:w-12 md:h-12 w-7 h-7" : "w-7 h-7";

    return isUpvoted ? (
        <svg
            className={`${sizeClasses} pointer-events-none text-green-600`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ verticalAlign: "middle" }}
        >
            <path
                d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    ) : (
        <svg
            className={`${sizeClasses} pointer-events-none`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ verticalAlign: "middle" }}
        >
            <path
                d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                fillRule="evenodd"
            />
        </svg>
    );
};

export default UpvoteIcon;
