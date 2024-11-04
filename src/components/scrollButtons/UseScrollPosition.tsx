import React from "react";

export function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return scrollPosition;

}