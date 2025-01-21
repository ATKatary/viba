export type webrtcMessageType = {
    sdp?: string
    candidate?: string
    sdpMid?: string
    sdpMLineIndex?: number
    type: "answer" | "offer" | "candidate" | "leave" | "start"
}

export type connectionType = {uid: string, pc: RTCPeerConnection}