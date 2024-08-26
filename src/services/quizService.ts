import {handleAuthError} from "../utils/handleAuthError";
import {AxiosError} from "axios";
import {ErrorResponse} from "../utils/types";
import api from "./api";


export const getQuiz = async (
    numberOfQuestions: string,
    grammaticalCategory?: string,
    language?: string,
    theme?: string
) => {
    try {
        const response = await api.get("/terms/quiz", {
            params: {
                number: numberOfQuestions,
                grammaticalCategory,
                language,
                theme,
            },
        });
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};

export const getFlashcardById = async (id: string) => {
    try {
        const response = await api.get(`/terms/${id}/flashcard`);
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }

}
