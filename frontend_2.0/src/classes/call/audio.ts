import * as React from "react";
import { Call, useCall } from ".";
import { webrtcMessageType } from "../../types/webrtc";

export function useVideo(call: Call) {
    let localAudio = React.useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        if (call.connections.length) {
            for (const [i, {uid, pc}] of call.connections.entries()) {
                pc.ontrack = (event) => {
                    const remoteVideo = document.getElementById(`remote-audio-caller-${uid}`) as HTMLAudioElement;
                    if (remoteVideo) {
                        remoteVideo.srcObject = event.streams[0]
                    }
                }
            }
        } 
    }, [call.connections]);

    React.useEffect(() => {
        if (call.localStream && localAudio.current) {
            localAudio.current.muted = true ;
            localAudio.current.srcObject = call.localStream;
        }
    }, [call.localStream])

    return {localAudio}
}

