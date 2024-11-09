import Skeleton from "react-loading-skeleton";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "../../services/userService";


function useQueryProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getUserProfile
    });
}


export function UserDetails() {
    const {data: profileData, isLoading, isError} = useQueryProfile()

    if (isLoading || isError) {
        return (<>
            <Skeleton height={80} width="100%"/>
            <Skeleton height={80} width="100%"/>
            <Skeleton height={50} width="100%"/>
        </>)
    }

    return profileData! && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="p-4 bg-background w-full text-center rounded-lg shadow-neumorphic">
                <span className="block text-lg font-semibold text-text">Username</span>
                <span className="block mt-2 text-xl text-text">{profileData.username}</span>
            </div>
            <div className="p-4 bg-background rounded-lg w-full text-center shadow-neumorphic">
                <span className="block text-lg font-semibold text-text">Role</span>
                <span className="block mt-2 text-xl text-text">{profileData.role}</span>
            </div>
        </div>
    )
}