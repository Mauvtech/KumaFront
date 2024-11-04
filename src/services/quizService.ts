import api from "./api";


export const getQuiz = async (
    numberOfQuestions: string,
    grammaticalCategory?: string,
    language?: string,
    theme?: string
) => {
    const response = await api.get("/terms/quiz", {
        params: {
            number: numberOfQuestions,
            grammaticalCategory,
            language,
            theme,
        },
    });
    return response.data;
};

export const getFlashcardById = async (id: string) => {
    const response = await api.get(`/terms/${id}/flashcard`);
    return response.data;
}
