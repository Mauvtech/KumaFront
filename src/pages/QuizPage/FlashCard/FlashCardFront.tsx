export function FlashCardFront({term, flip}: { term: string, isFlipped: boolean, flip: () => void }) {
    return (
        <button
            onClick={() => flip()}
            className={`
                 absolute inset-0
              w-full h-full
                bg-white rounded-xl p-8
                flex items-center justify-center
                cursor-pointer 
                shadow-lg
              hover:shadow-xl
              transition-shadow
            `}
            style={{backfaceVisibility: 'hidden'}}
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {term}
                </h2>
                <p className="text-gray-600 text-sm">Click to reveal answer</p>
            </div>
        </button>
    );
}