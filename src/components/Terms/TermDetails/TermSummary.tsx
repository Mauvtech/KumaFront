import React from "react";


export type TermSummary = {
    term: string;
    definition: string;
    translation: string;
    grammaticalCategory: string;
    language: string;
    tags: string[];
}

export function TermSummary({term, definition, grammaticalCategory, tags, language, translation}: TermSummary) {

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-text">{term}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-primary-light text-primary text-xs px-2 rounded-full">
                            {grammaticalCategory}
                        </span>
                <span className="bg-secondary-light text-secondary text-xs px-2 rounded-full">
                            {tags.join()}
                        </span>
                <span className="bg-accent-light text-accent text-xs px-2 rounded-full">
                            {language}
                        </span>
            </div>
            <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                <p className="font-semibold text-text">Definition</p>
                <p>{definition}</p>
            </div>
            <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                <p className="font-semibold text-text">Translation</p>
                <p>{translation}</p>
            </div>
        </>

    )
}