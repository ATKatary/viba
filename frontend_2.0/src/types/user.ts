import { chatType } from "./chat"

export type userType = {
    id: string 
    pfp: string 
    name: string 
    email: string 

    chats: [chatType]
}