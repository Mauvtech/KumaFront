import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface FilterButtonsProps {
    title: string;
    options: string[];
    selectedOption: string;
    onSelectOption: (option: string) => void;
    loading: boolean;
}

function FilterButtons({ title, options, selectedOption, onSelectOption, loading }: FilterButtonsProps) {
    return (
        <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-gray-700">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} width={100} height={40} />
                    ))
                ) : (
                    options.map(option => (
                        <button
                            key={option}
                            onClick={() => onSelectOption(option)}
                            className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 focus:outline-none
                                ${selectedOption === option ? 'bg-gray-500 text-white shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]' : 'bg-gray-200 text-gray-600 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]'}`}
                        >
                            {option}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default FilterButtons;
