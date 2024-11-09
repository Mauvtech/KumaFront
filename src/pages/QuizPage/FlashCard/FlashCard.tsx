import {useState} from "react";
import {FlashCardFront} from "./FlashCardFront";
import {FlashCardBack} from "./FlashCardBack";

export function FlashCard({term, definition}: { term: string, definition: string }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <>
            <FlashCardFront term={term} isFlipped={isFlipped} flip={() => setIsFlipped(true)}/>
            <FlashCardBack definition={definition} isFlipped={isFlipped}/>
        </>

    );
}

