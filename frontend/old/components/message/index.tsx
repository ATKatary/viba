import * as React from "react";

import { Typography } from "@mui/material";

import { UserPFP } from "./user";
import { ThemeContext } from "../../../src";
import { userType } from "../../../src/types/user";
import { messageType } from "../../../src/types/chat";
import { MessageAttachments } from "./attachment";
import MessageText from "./text";
import { styles } from "../../../src/styles";

interface MessageProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    user: userType
    isGroup: boolean 
    prevSender?: userType
    message: messageType
}

function Message(props: MessageProps) {
    const {user, isGroup, prevSender, message, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const theme = React.useContext(ThemeContext);

    const mine = React.useMemo(() => user.id === message?.sender.id, [user, message]);
    const sameSender = React.useMemo(() => prevSender?.id === message.sender.id, [prevSender, message]);

    const showSenderInfo = React.useMemo(() => !mine && isGroup && !sameSender, [mine, isGroup, sameSender])
    return (
        <div style={{...style, alignSelf: mine? "flex-end" : "flex-start", maxWidth: "60%"}} className={`flex align-end`}>
            <UserPFP user={message.sender} show={showSenderInfo} filler={!mine && isGroup && sameSender}/>
            <div 
                onContextMenu={(event) => {

                }}
                style={{marginTop: isGroup && !sameSender? 10 : 0}}
                className={`flex column ${mine? "align-end" : "align-start"}`} 
            >
                {showSenderInfo? 
                    <Typography 
                        sx={{fontSize: 10, margin: `0 ${mine? 10:0}px 0 ${mine? 0:10}px`}}>
                            {message.sender.name}
                    </Typography> 
                    : <></>
                }

                <MessageAttachments 
                    attachments={message.attachments}
                    attachmentStyle={{
                        ...styles.openChatAttachment(theme?.isDark, "fit-content"),
                        ...styles.messageMargin(mine),
                        ...styles.messageBorderRadius(mine),
                    }}
                />
                <MessageText text={message.text} mine={mine}/>
            </div>
        </div>
    )
}

export default Message;