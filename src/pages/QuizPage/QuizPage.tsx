import {getQuiz} from "../../services/quizService";
import {useQuery} from "@tanstack/react-query";
import {FlashCard} from "./FlashCard/FlashCard";
import {Button} from "../../components/ui/button";


export default function QuizPage() {
    const {data} = useQuery(
        {queryKey: ["terms"], queryFn: () => getQuiz()});


    return (
        <div>
            {data?.map((term) => (
                <FlashCard term={term.name} definition={term.definition}/>
            ))}
            <Button>Suivant</Button>
        </div>
    )
}

