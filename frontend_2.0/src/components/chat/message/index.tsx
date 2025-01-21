import * as React from "react";

import "../../../assets/css/message.css";

import MessageText from "./text";
import { messageType } from "../../../types/chat";
import { userType } from "../../../types/user";
import { isMyMessage } from "../../../utils/chats";
import { Backdrop } from "@mui/material";
import ChatStyleSheet from "../../../styles/chat";
import { makeId } from "../../../utils";
import MessageAttachment from "./attachment";

interface MessageProps extends React.PropsWithChildren<any> {
    user: userType
    messages: messageType[]
}
function Message(props: MessageProps) {
    const {user, messages, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const n = messages.length;
    const id = React.useMemo(() => `message-${makeId(9)}`, []);
    const mine = React.useMemo(() => isMyMessage(messages[0], user), [user, messages]);

    return (
        <div className={`flex message ${mine? "justify-end" : ""}`} style={{...style}}>
            <div 
                id={id}
                style={{maxWidth: "70%"}}
                className={`flex column ${mine? "align-end" : ""}`}
            >
                <MessageAttachment 
                    mine={mine} 
                    uid={user.id}
                    first={n > 1}
                    showPfp={!mine}
                    message={messages[0]} 
                    showTimeStamp={n === 1}
                />
                {messages.slice(1, n - 1).map((message, i) => {
                    return (
                        <MessageAttachment mine={mine} message={message} uid={user.id} />
                    )
                })}
                {n > 1? 
                    <MessageAttachment 
                        last
                        mine={mine}
                        uid={user.id}
                        showTimeStamp
                        message={messages[n - 1]} 
                    />
                : <></>}
            </div>
        </div>
    )
}

export default Message;