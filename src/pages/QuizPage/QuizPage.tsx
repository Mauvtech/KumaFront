import {getQuiz} from "../../services/quizService";
import {useQuery} from "@tanstack/react-query";
import {Button} from "../../components/ui/button";
import {useEffect} from "react";
import {useQuizStore} from "./QuizStore";
import {useNavigate} from "react-router-dom";


export default function QuizPage() {

    const navigate = useNavigate()
    const {data, isError} = useQuery(
        {
            queryKey: ["terms"],
            queryFn: () => getQuiz(),
        }
    );


    useEffect(() => {
        if (isError) return;
        useQuizStore.setState({quiz: data})
    })

    if (!data) {
        return <div>Loading...</div>
    }

    const card = data[0]

    return (
        <div className={"min-h-screen w-full flex justify-center"}>
            <div className={"p-4 self-center"}>
                <Button onClick={() => navigate("current/" + 0)}>Commencer un quiz</Button>
            </div>
        </div>
    )
}


