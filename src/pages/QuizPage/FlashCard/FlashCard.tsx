import {useState} from "react";
import {FlashCardFront} from "./FlashCardFront";
import {FlashCardBack} from "./FlashCardBack";


export function FlashCard({term, definition}: { term: string, definition: string }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-64" style={{perspective: '1000px'}}>
                <div
                    className={`
                                relative w-full h-full
                                transition-all duration-500
                                hover:shadow-2xl
                              `}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : ''
                    }}
                >
                    <FlashCardFront term={term} isFlipped={isFlipped} flip={() => setIsFlipped(!isFlipped)}/>
                    <FlashCardBack definition={definition} isFlipped={isFlipped} flip={() => setIsFlipped(!isFlipped)}/>
                </div>
            </div>
        </div>
    );
}

