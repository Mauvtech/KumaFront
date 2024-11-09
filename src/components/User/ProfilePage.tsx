import React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import {UserDetails} from "./UserDetails";
import {UserTerms} from "./UserTerms";


export default function ProfilePage() {
    return (
        <div className={"w-full p-8 mt-16"}>
            <UserDetails/>
            <UserTerms/>
        </div>
    );
}