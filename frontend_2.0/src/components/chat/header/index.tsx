import * as React from "react";

import { Typography } from "@mui/material";

import ChatIcon from "../icon";
import { userType } from "../../../types/user";
import { chatType } from "../../../types/chat";
import { getChatPFP, isGroup } from "../../../utils/chats";
import ChatStyleSheet from "../../../styles/chat";

interface ChatHeaderProps extends React.PropsWithChildren<any> {
    i: number
    setI: (i: number) => void

    user: userType
    chat: chatType

    onSettings?: () => void
}
function ChatHeader(props: ChatHeaderProps) {
    const {i, setI, chat, user, ...domProps} = props;
    const {onSettings, ...rest} = domProps;
    
    const group = isGroup(chat);

    return (
        <div className="fixed header flex align-center justify-between">
            <div className="flex align-center justify-between width-100">
                <button className={`icon-header-back`} onClick={() => setI(-1)}></button>
                <div 
                    className="chat-header-pfp-container flex align-center overflow-hidden"
                    style={{
                        width: group? "calc(100% - 2*var(--font-size-icon) - 3px - 30px)" : "calc(100% - 3*var(--font-size-icon) - 6px - 55px)"
                    }}
                    onClick={onSettings}
                >
                    <ChatIcon src={getChatPFP(chat, user)} className="icon-chat-header-pfp"/>
                    <Typography 
                            className="chat-thumbnail-title overflow-hidden text-overflow-ellipsis" 
                            sx={{...ChatStyleSheet.thumbnailTitle}}
                        >
                            {chat.title}
                        </Typography>
                </div>
                {!group? <button className={`icon-chat-video`} style={{marginRight: "25px"}}></button> : <></>}
                <button className={`icon-chat-video`}></button>
            </div>
        </div>  
    )
}

export default ChatHeader;