import * as React from "react";
import { messageType } from "../../../types/chat";
import MessageText from "./text";

interface MessageAttachmentProps extends React.PropsWithChildren<any> {
    uid: string 
    mine: boolean
    last?: boolean
    first?: boolean 
    showPfp?: boolean
    message: messageType
    showTimeStamp?: boolean
}
function MessageAttachment(props: MessageAttachmentProps) {
    const {message, ...domProps} = props;
    
    return (
        <>
        {message.attachments?
        <div 
            className={`width-100 flex column ${props.mine? "align-end" : ""}`}
        >
            {message.attachments.map((attachment, i) => {
                return (
                    <MessageText 
                        {...domProps} 
                        message={message} 
                        className={`relative`}
                        contentContainerStyle={{padding: "0px", backgroundColor: "transparent"}}
                    >
                        {attachment.imageUrl?
                            <img 
                                key={attachment.id} 
                                src={attachment.imageUrl} 
                                className={`
                                    message-attachment-img 
                                    message-text${props.first? "-first" : props.last? "-last" : ""}${props.mine? "-mine" : ""}
                                `}
                            /> : <></>
                        }
                    </MessageText>
                )
            })}
        </div> : <></>}
        <MessageText {...props}/>
        </>
    )
}

export default MessageAttachment;