import {motion} from "framer-motion";
import MouseIcon from "@mui/icons-material/Mouse";
import React from "react";

export default function ScrollDownMouseIcon() {

    return (
        <motion.div
            className="absolute bottom-8 flex flex-col items-center"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <motion.div
                animate={{y: [0, 10, 0]}}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <MouseIcon fontSize="large" className="text-primary"/>
            </motion.div>
            <p className="text-sm sm:text-base text-primary mt-2">
                Scroll Down
            </p>
        </motion.div>
    )

}