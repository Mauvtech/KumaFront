import React from "react";
import {useNavigate} from "react-router-dom";
import {Modal} from "../Modal";
import {TermSummary} from "./TermDetails/TermSummary";
import {useMutation} from "@tanstack/react-query";
import {addTerm} from "../../services/term/termService";


export default function TermCreationValidationModal({term}: { term: TermSummary | null }) {

    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: addTerm,
        onSuccess: () => navigate("/")
    })

    if (!term) return null;

    return (
        <Modal open={!!term} onOk={() => mutate({...term, theme: term.tags[0]})} className={"w-1/2"}>
            <h2 className="text-xl font-bold mb-4">Résumé</h2>
            <TermSummary {...term}/>
        </Modal>
    );
}


