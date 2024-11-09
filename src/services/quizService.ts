import api from "./api";
import {Term} from "./term/termModel";


export const getQuiz = async (
    numberOfQuestions?: string,
    grammaticalCategory?: string,
    language?: string,
    theme?: string
): Promise<Term[]> => {
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