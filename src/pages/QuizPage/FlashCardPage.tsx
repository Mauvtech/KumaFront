import {useNavigate, useParams} from "react-router-dom";
import {useQuizStore} from "./QuizStore";
import {Button} from "../../components/ui/button";
import {FlashCard} from "./FlashCard/FlashCard";

export function FlashCardPage() {
    const {cardId} = useParams()

    const navigate = useNavigate()

    const quiz = useQuizStore.getState().quiz

    console.log(quiz)

    if (!cardId) {
        return <div>Une erreur est survenue, veuillez retourner à la page de création du quiz</div>
    }

    let card

    try {
        card = quiz[parseInt(cardId)]
    } catch (e) {
        console.log(e)
    }

    if (!card) {
        return <div>Le quiz est terminé, veuillez retourner à la page de création du quiz</div>
    }


    return (
        <>
            <div className={"min-h-screen w-full flex flex-col"}>
                <div className={"h-[66vh] relative min-h-[400px]"}>
                    <FlashCard term={card.name} definition={card.definition}/>
                </div>

                <div className={"p-4 self-center"}>
                    <Button className={"w-32"} onClick={() => navigate("/quiz/current/" + (parseInt(cardId) + 1))}>
                        suivant</Button>
                </div>
            </div>

        </>
    );
}