import {AnimatePresence, motion} from "framer-motion";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import React from "react";
import {useScrollPosition} from "./UseScrollPosition";

export default function ScrollToTopButton() {

    const scrollPosition = useScrollPosition();

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <AnimatePresence>
            {scrollPosition > 300 &&
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 md:right-10 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primaryDark transition duration-300"
                    initial={{opacity: 0, scale: 0}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0}}
                    transition={{type: "spring", stiffness: 260, damping: 20}}
                    whileHover={{scale: 1.1}}
                >
                    <ArrowUpwardIcon/>
                </motion.button>
            }
        </AnimatePresence>
    )
}