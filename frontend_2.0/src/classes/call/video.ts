import * as React from "react";
import { Call, useCall } from ".";
import { webrtcMessageType } from "../../types/webrtc";

export function useVideo(call: Call) {
    let localVideo = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (call.connections.length) {
            for (const [i, {uid, pc}] of call.connections.entries()) {
                pc.ontrack = (event) => {
                    const remoteVideo = document.getElementById(`remote-video-caller-${uid}`) as HTMLVideoElement;
                    console.log("[useVideo] (remoteVideo) >>", remoteVideo)
                    if (remoteVideo) {
                        remoteVideo.srcObject = event.streams[0]
                    }
                }
            }
        } 
    }, [call.connections]);

    React.useEffect(() => {
        if (call.localStream && localVideo.current) {
            localVideo.current.muted = true ;
            localVideo.current.srcObject = call.localStream;
        }
    }, [call.localStream])

    return {localVideo}
}

