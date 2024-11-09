import {Term} from "../../services/term/termModel";
import {create} from "zustand/react";

export type QuizStore = {
    quiz: Term[],
    setQuiz: (quiz: Term[]) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
    quiz: [],
    setQuiz: (quiz) => set({quiz}),
}))
