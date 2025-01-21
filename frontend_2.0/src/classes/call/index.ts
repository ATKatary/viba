import * as React from "react";
import { ApolloCache, DefaultContext, FetchResult, MutationFunctionOptions, OperationVariables, useMutation, useSubscription } from "@apollo/client";

import { notify } from "./notify";
import { webrtcConfig } from "../../api/webrtc";
import { CallInterface } from "../../interfaces";
import { BROADCAST } from "../../graphql/mutations/chat";
import { WATCH_CALL } from "../../graphql/subscriptions/call";
import { webrtcMessageType, connectionType } from "../../types/webrtc";

type mutationType = (options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, ApolloCache<any>> | undefined) => Promise<FetchResult<any>>;

export class Call implements CallInterface {
    cid?: string
    setCid: (cid?: string) => any

    uid?: string
    setUid: (cid: string) => any

    callerUid?: string
    setCallerUid: (callerUid?: string) => any

    callerCid?: string
    setCallerCid: (callerCid?: string) => any

    connections: connectionType[]
    setConnections: (connections: connectionType[]) => any

    localStream?: MediaStream
    setLocalStream: (localStream?: MediaStream) => any

    open?: boolean
    setOpen: (open: boolean) => any

    type: "audio" | "video"  
    broadcast: mutationType  

    constructor(type: "audio" | "video", broadcast: mutationType, uid?: string) {
        this.setCid = (cid) => {}

        this.uid = uid
        this.setUid = (uid) => {}

        this.setCallerUid = (callerUid) => {}
        this.setCallerCid = (callerCid) => {}

        this.connections = []
        this.setConnections = (connections) => {}

        this.localStream = undefined
        this.setLocalStream = (localStream) => {}

        this.type = type 
        this.broadcast = broadcast

        this.setOpen = (open) => {}
    }

    async stream(): Promise<MediaStream> {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: this.type === "video", 
            audio: { echoCancellation: true }
        })
        this.setLocalStream(localStream);
        return localStream;
    }

    get(uid: string) {
        return this.connections.find(connection => connection.uid === uid)?.pc;
    }

    connect(uid: string, pc: RTCPeerConnection) {
        const updatedConncections = this.connections.filter(connection => connection.uid !== uid)
        this.setConnections([...updatedConncections, {uid: uid, pc: pc}])
    }

    disconnect(uid: string) {
        const pc = this.get(uid);
        pc?.close();

        this.setConnections(this.connections.filter(connection => connection.uid !== uid))
    }

    async start(cid: string): Promise<void> {
        if (!this.uid) return;
        console.log(`[Call][start] >> ${this.uid}'s started call`)
        await this.stream();
        
        this.setCid(cid);
        this.setOpen(true);
        this.broadcast({variables: {id: cid, uid: this.uid, message: JSON.stringify({type: "start"})}})
    }

    async initialize(uid: string, cid: string): Promise<RTCPeerConnection | void> {
        if (!this.uid) return;
        console.log(`[Call][initialize] >> initializing ${this.uid}'s peer connection...`)

        let pc = this.get(uid);
        if (!pc) {
            pc = new RTCPeerConnection(webrtcConfig);
        }

        if (pc) {
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const message: webrtcMessageType = {
                        type: "candidate",
                        candidate: event.candidate.candidate,
                        sdpMid: event.candidate.sdpMid || undefined,
                        sdpMLineIndex: event.candidate.sdpMLineIndex || undefined
                    };
                    this.broadcast({variables: {id: cid, uid: this.uid, message: JSON.stringify(message)}});
                }
            }
        }

        let localStream: MediaStream;
        if (this.localStream) {
            localStream = this.localStream
        } else {
            localStream = await this.stream()
        }

        if (this.type === "video") {
            localStream.getVideoTracks().forEach((track) => pc?.addTrack(track, localStream));
        }
        localStream.getAudioTracks().forEach((track) => pc?.addTrack(track, localStream));
        
        this.connect(uid, pc);
        return pc;
    }

    async join(cid: string): Promise<void> {
        console.log(`[Call][join] >> ${this.uid}'s joining call...`)

        if (!this.uid || !this.callerUid) return;
        const pc = await this.initialize(this.callerUid, cid);
        const offer = await pc?.createOffer();

        this.setCid(cid);
        this.broadcast({variables: {id: cid, uid: this.uid, message: JSON.stringify({type: "offer", sdp: offer?.sdp})}});
        await pc?.setLocalDescription(offer);
    }

    async answer(uid: string, offer?: webrtcMessageType): Promise<void> {
        console.log(`[Call][answer] ${this.uid} recieved from ${uid} an (offer) >>`, offer)
        if (!this.cid || !this.uid) return;

        let pc = this.get(uid)
        if (pc) {
            console.log(`${uid} already connected`);
            return
        } else {
            pc = await this.initialize(uid, this.cid) || undefined;
        }

        if (offer) pc?.setRemoteDescription({...offer, type: "offer"});
        
        switch (pc?.signalingState) {
            case "stable":
            case "have-remote-offer":
            case "have-local-pranswer":
                const answer = await pc?.createAnswer();
                this.broadcast({variables: {id: this.cid, uid: this.uid, message: JSON.stringify({type: "answer", sdp: answer?.sdp})}});
                await pc?.setLocalDescription(answer);
                break; 
            default: break;
        }
    }

    async leave(): Promise<void> {
        if (!this.cid || !this.uid) return
        console.log(`[Call][answer] leaving call`)
        for (const [i, {uid, pc}] of this.connections.entries()) {
            pc.close()
        }

        this.broadcast({variables: {id: this.cid, uid: this.uid, message: JSON.stringify({type: "leave"})}});
        
        this.setOpen(false);
        this.setCid(undefined);
        this.setConnections([]);
        this.setCallerCid(undefined);
        this.setCallerUid(undefined);
        this.setLocalStream(undefined);
        this.localStream?.getTracks().forEach((track) => track.stop());
    }

    mute() {
        this.localStream?.getAudioTracks().forEach((track) => track.enabled = false);
    }

    unMute() {
        this.localStream?.getAudioTracks().forEach((track) => track.enabled = true);
    }

    showVideo() {
        this.localStream?.getVideoTracks().forEach((track) => track.enabled = true);
    }

    hideVideo() {
        this.localStream?.getVideoTracks().forEach((track) => track.enabled = false);
    }
}

export function useCall(uid?: string, type?: "audio" | "video") {
    const [broadcast] = useMutation(BROADCAST);
    const callSubscription = useSubscription(WATCH_CALL, {variables: {uid: uid}});
    
    const call = new Call(type || "audio", broadcast, uid);

    [call.cid, call.setCid] = React.useState<string>();
    [call.uid, call.setUid] = React.useState<string>();
    [call.open, call.setOpen] = React.useState<boolean>();
    [call.callerUid, call.setCallerUid] = React.useState<string>();
    [call.callerCid, call.setCallerCid] = React.useState<string>();
    [call.localStream, call.setLocalStream] = React.useState<MediaStream>();
    [call.connections, call.setConnections] = React.useState<connectionType[]>([]);
    
    React.useEffect(() => {
        if (uid) {
            call.setUid(uid);
        } 
    }, [uid])

    React.useEffect(() => {
        if (callSubscription?.data) {
            let {data, cid, uid} = callSubscription?.data.watchCall as {data: string, cid: string, uid: string}
            const message = JSON.parse(data) as webrtcMessageType
            // console.log("[useCall] (message) >>", message)

            const pc = call.get(uid)
            if (!pc) {
                console.log("[useCall][onCandidate] >> No peerconnection")
            }

            switch (message.type) {
                case "start":
                    call.setOpen(true);
                    call.setCallerUid(uid);
                    call.setCallerCid(cid);
                    console.log(`${uid} is calling you!`)
                    break;
                case "offer":
                    call.answer(uid, message)
                    break
                case "answer":
                    console.log("[useCall] (answer) >>", message)
                    if (pc?.signalingState !== "stable") pc?.setRemoteDescription({...message, type: "answer"})
                    // call.answer(uid)
                    break
                case "candidate":
                    if (message && pc?.remoteDescription) pc?.addIceCandidate(message)
                    break
                case "leave":
                    if (call.connections.length > 1) {
                        call.disconnect(uid)
                    } else call.leave()
                    break
                default: break
            }
        }
    }, [callSubscription.data])

    return {call}
}

