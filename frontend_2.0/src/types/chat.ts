import { userType } from "./user"

/*** Chat ***/
export type chatType = {
    id: string 
    title: string
    unreadCount: number
    
    admins: userType[]
    members: userType[] 
    
    messages: messageType[]
}

export type openChatPropsType = {
    uid?: string
    cid?: string
    chat?: chatType

    className?: string
    style?: React.CSSProperties
}

export type chatsPropsType = {
    uid?: string
    cid?: string
    chats?: chatType[]

    className?: string
    style?: React.CSSProperties
    onClick?: (cid: string) => any
}

/*** Message ***/
export type attachmentType = {
    id: string 
    imageUrl: string 
    fileUrl: string
}

export type reactionType = {
    id: string
    emoji: string
    user: userType
}

export type messageType = {
    id: string
    sender: userType

    text: string 
    timeSent: string
    attachments: attachmentType[]
    status: "read" | "delivered" | "sent"
    reactions: reactionType[]
}
export type messagePropsType = {
    uid?: string
    mid?: string
    message?: messageType

    className?: string
    style?: React.CSSProperties
}