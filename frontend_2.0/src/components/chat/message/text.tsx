import * as React from "react";

import { Backdrop } from "@mui/material";

import Actions from "./actions";
import Reactions, { Emoji } from "./reactions";
import ChatStyleSheet from "../../../styles/chat";
import { messageType } from "../../../types/chat";
import { getTimeSentTimeString, isEmoji } from "../../../utils/chats";
import { useMutation } from "@apollo/client";
import { REACT_MESSAGE } from "../../../graphql/mutations/message";

interface MessageTextProps extends React.PropsWithChildren<any> {
    uid: string
    mine: boolean
    last?: boolean
    first?: boolean 
    showPfp?: boolean
    message?: messageType
    showTimeStamp?: boolean

    contentContainerStyle?: React.CSSProperties
}
function MessageText(props: MessageTextProps) {
    const {uid, message, mine, showPfp, first, last, showTimeStamp, ...domProps} = props;
    const {children, style, className, contentContainerStyle, ...rest} = domProps;

    const [react] = useMutation(REACT_MESSAGE);

    const emoji = isEmoji(message?.text || "");
    const container = React.useRef<HTMLDivElement>(null);
    const [showActions, setShowActions] = React.useState(false);

    const onActions = () => {
        if (container.current) {
            container.current.scrollIntoView({behavior: "smooth", block: "center"});
            container.current.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }
    const onContextMenu = (event:  React.MouseEvent) => {
        onActions()
        setShowActions(true);
        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <>
        <Reactions 
            message={message} 
            open={showActions} 
            onClick={async (reaction: string) => {
                await react({
                    variables: {
                        id: message?.id,
                        uid: uid, 
                        reaction: reaction
                    }
                })
            }}
            style={{marginLeft: !mine? "calc(var(--font-size-icon) + 20px)" : "0"}}
        />
        <div 
            style={{
                ...style, 
                zIndex: showActions? 3 : 0,
                flexDirection: mine? "row-reverse" : "row"
            }}
            ref={container}
            onClick={onContextMenu}
            className={`flex align-center width-100 ${className || ""}`} 
        >
            {showPfp? <img src={message?.sender.pfp} className="icon-header-img circle"/> : <></>}
            <div className={`flex column align-baseline message-text-emoji-container${mine? "-mine" : ""}`}>
                <div 
                    style={{
                        marginLeft: "calc(var(--font-size-icon) + 20px)",
                        ...contentContainerStyle
                    }}
                    className={`
                        message-text-container${mine? "-mine" : ""}${emoji? "-emoji" : ""} 
                        message-text${first? "-first" : last? "-last" : ""}${mine? "-mine" : ""}
                        ${showPfp? "-with-pfp" : ""}
                    `}
                >
                    {children? children : 
                        <>
                        {showPfp && !emoji? <p className="message-text-sender-name">{message?.sender.name}</p> : <></>}
                        <p className={`message-text-content${emoji? "-emoji" : ""}`}>{message?.text}</p>
                        {showTimeStamp? <p className={`message-time-send${mine? "-mine" : ""}`}>{getTimeSentTimeString(message)}</p> : <></>}
                        </>
                    }
                </div>
                {message?.reactions.length? 
                    <div className={`message-text-emoji${mine? "-mine" : ""} flex align-center justify-center`}><p>{message?.reactions.at(-1)?.emoji}</p></div>
                    : <></>
                }
            </div>
        </div>
        <Actions 
            mine={mine}
            message={message}
            setOpen={setShowActions}
            open={showActions || false} 
            style={{marginLeft: !mine? "calc(var(--font-size-icon) + 20px)" : "0"}}
        />

        <Backdrop
            open={showActions}
            sx={{
                ...ChatStyleSheet.backdrop,
            }}
            onClick={() => {
                setShowActions(false);
            }}
        ></Backdrop>
        </>
    )
}

export default MessageText;