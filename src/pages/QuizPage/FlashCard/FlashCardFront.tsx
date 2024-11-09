export function FlashCardFront({term, isFlipped, flip}: { term: string, isFlipped: boolean, flip: () => void }) {
    return (
        <div
            className={`
              absolute w-full h-full bg-white rounded-xl shadow-lg p-8
              flex items-center justify-center
              transition-all duration-500
              ${isFlipped ? 'opacity-0' : 'opacity-100'}
            `}
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {term}
                </h2>
                <p className="text-gray-600 text-sm" onClick={flip}>Click to reveal answer</p>
            </div>
        </div>
    );
}