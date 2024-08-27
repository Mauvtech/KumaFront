import TermItemSkeleton from "./TermItemSkeleton";
import {motion} from "framer-motion";
import TermItem from "../../components/Terms/TermItem";
import Skeleton from "react-loading-skeleton";
import React from "react";
import {TermForUser} from "../../services/term/termModel";
import {DEFAULT_TERM_PER_PAGE} from "./HomePage";

const termVariants = {
    hidden: {opacity: 0, y: 50},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
};

type ApprovedTermsListProps = {
    loading: boolean;
    terms: TermForUser[]
}

export default function ApprovedTermsList({loading, terms}: ApprovedTermsListProps) {


    if (loading) {
        return (
            <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                {Array.from({length: DEFAULT_TERM_PER_PAGE * 2}).map((_, index) => (
                    <TermItemSkeleton key={index}/>
                ))}
            </ul>
        )
    }

    if (terms.length === 0) {
        return <p className="text-center text-text">No terms found.</p>
    }


    return (
        <motion.ul
            className={`grid ${terms && terms.length > 5
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6"
                : "grid-cols-1"
            }`}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {transition: {staggerChildren: 0.1}},
            }}
        >
            {terms?.map((term) => (
                <motion.li key={term.term.id} variants={termVariants}>
                    <TermItem
                        isFeed={true}
                        termForUser={term}
                    />
                </motion.li>
            ))}
            {loading && terms && terms.length > 1 && (
                <li className="flex justify-center">
                    <Skeleton height={35} width="90%"/>
                </li>
            )}
        </motion.ul>
    )


}