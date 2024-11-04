import Skeleton from "react-loading-skeleton";
import React from "react";


export default function TermDetailsSkeleton() {
    return (
        <div>
            <Skeleton height={32} width="60%" className="mb-4"/>
            <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton width={100} height={20} className="rounded-full"/>
                <Skeleton width={100} height={20} className="rounded-full"/>
                <Skeleton width={100} height={20} className="rounded-full"/>
            </div>
            <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                <Skeleton height={20}/>
                <Skeleton height={20} width="80%"/>
            </div>
            <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                <Skeleton height={20}/>
                <Skeleton height={20} width="80%"/>
            </div>
            <Skeleton height={40} width="30%"/>
        </div>
    )
}