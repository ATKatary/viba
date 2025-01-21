import { userType } from "./types/user"
import { chatType } from "./types/chat"
import { interfaceStateType } from "./types"
import { webrtcMessageType } from "./types/webrtc"

export interface GenericClassInterface<T> {
    state: interfaceStateType

    obj?: T
    id?: string 

    initialize(id?: string): Promise<void> 

    get<T>(id: string): Promise<T | void>
}

export interface AuthInterface {
    id: string | null
    isAuthenticated: boolean | null
    user: userType | null

    logout(): Promise<boolean>
    needsPasswordChange(): Promise<any>
    updatePassword(password : string): Promise<any>
    login(email: string, password: string): Promise<any>
    sendResetPasswordEmail(email : string): Promise<any>
    initialize(name?: string): Promise<userType | null>
    signup(email: string, password: string): Promise<any>
}

export interface UserInterface extends GenericClassInterface<userType> {}
export interface ChatInterface extends GenericClassInterface<chatType> {}

export interface CallInterface {
    cid?: string
    uid?: string 

    pc?: RTCPeerConnection
    localStream?: MediaStream

    leave(): Promise<void> 
    join(cid: string): Promise<void> 
    start(cid: string): Promise<void> 
    answer(uid: string, offer: webrtcMessageType): Promise<void> 
    initialize(uid: string, cid: string): Promise<RTCPeerConnection | void> 
}