import Skeleton from "react-loading-skeleton";
import React from "react";


export default function TermItemSkeleton({key}: {
    key: any
}) {
    return (<li
        key={key}
        className="flex flex-col justify-between mb-4 p-6 bg-background rounded-lg shadow-neumorphic h-[60vh]"
    >
        <div className="flex items-center mb-4">
            <Skeleton
                circle={true}
                height={80}
                width={80}
                className="mr-4"
            />
            <Skeleton height={30} width="50%"/>
        </div>
        <div className="flex-1">
            <Skeleton height={35} width="90%" className="mb-2"/>
            <Skeleton height={25} width="100%" className="mb-2"/>
            <Skeleton height={20} width="95%" className="mb-2"/>
            <Skeleton height={20} width="95%"/>
        </div>
        <div className="flex justify-between items-center mt-4">
            <Skeleton height={25} width="35%"/>
            <Skeleton height={50} width="50px" circle={true}/>
        </div>
    </li>)
}