import React from "react";
import Track from "./Track";

export default function TrackList({ tracks = [], actionLabel = '+', onAction }) {
    if (tracks.length === 0) {
        return <div>No tracks available.</div>;
    }   

    return (
        <div>
            {tracks.map((t) => (
                <Track
                    key={t.id}
                    track={t}
                    actionLabel={actionLabel}   
                    onAction={onAction}
                />
            ))}
        </div>
    );
}