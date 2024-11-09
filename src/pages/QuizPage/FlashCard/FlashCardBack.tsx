export function FlashCardBack({definition, flip}: { definition: string, isFlipped: boolean, flip: () => void }) {
    return (
        <button
            onClick={flip}
            className={`
                 absolute inset-0
              w-full h-full
           bg-white rounded-xl p-8
          flex items-center justify-center
          shadow-lg
          hover:shadow-xl
          transition-shadow
        `}
            style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
            }}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{definition}</h2>
            </div>
        </button>
    );
}