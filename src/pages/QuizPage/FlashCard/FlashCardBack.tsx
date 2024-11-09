export function FlashCardBack({definition, isFlipped}: { definition: string, isFlipped: boolean }) {
    return (
        <div className={`
          absolute w-full h-full bg-white rounded-xl shadow-lg p-8
          flex items-center justify-center
          transform ${isFlipped ? 'opacity-100' : 'rotate-y-180 opacity-0'}
          transition-all duration-700 backface-hidden
        `}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{definition}</h2>
            </div>
        </div>
    );
}