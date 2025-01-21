import * as React from "react";

import { Typography } from "@mui/material";

import "../../assets/css/chat.css";

import ChatIcon from "./icon";
import { chatType } from "../../types/chat";
import { userType } from "../../types/user";
import ChatStyleSheet from "../../styles/chat";
import { getChatPFP, getTimeSentDateString } from "../../utils/chats";

interface ChatThumbnailProps extends React.PropsWithChildren<any> {
    user: userType
    chat: chatType
    active?: boolean
}
function ChatThumbnail(props: ChatThumbnailProps) {
    const {user, chat, active, ...domProps} = props;
    const {onClick, ...rest} = domProps;
    
    const unread = chat.unreadCount > 0;
    const lastMessage = chat.messages[props.chat.messages.length - 1];

    return (
        <div className="flex chat-thumbnail-container" onClick={onClick}>
            <ChatIcon className="chat-thumbnail-icon" src={getChatPFP(chat, user)} />
            <div className="flex align-start justify-between chat-thumbnail-text-container">
                <div className="flex column overflow-hidden" style={{width: "70%"}}>
                    <Typography 
                        className="chat-thumbnail-title overflow-hidden text-overflow-ellipsis" 
                        sx={{...ChatStyleSheet.thumbnailTitle}}
                    >
                        {props.chat.title}
                    </Typography>
                    <Typography 
                        className="chat-thumbnail-text overflow-hidden text-overflow-ellipsis" 
                        sx={{...ChatStyleSheet.thumbnailText, fontWeight: unread? "bold" : "normal"}}
                    >
                        {lastMessage?.text}
                    </Typography>
                </div>
                <div className="flex column align-center">
                    <Typography sx={{...ChatStyleSheet.thumbnailTime}}>{getTimeSentDateString(lastMessage)}</Typography>
                    {unread? <Typography sx={{...ChatStyleSheet.thumbnailUnread}}></Typography> : <></>}
                </div>
            </div>
        </div>
    )
}

export default ChatThumbnail;