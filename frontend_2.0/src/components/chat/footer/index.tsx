import * as React from "react";

import ImageMessage from "./image";
import VoiceMessage from "./voice";
import AttachMessage from "./attach";
import ChatInput from "./input";
import { useMutation } from "@apollo/client";
import { setDisplay, setWidth } from "../../../utils";
import { SEND_MESSAGE } from "../../../graphql/mutations/message";
import { userType } from "../../../types/user";

interface ChatFooterProps extends React.PropsWithChildren<any> {
    cid: string
    user: userType
}
function ChatFooter(props: ChatFooterProps) {
    const {cid, user, ...domProps} = props;
    
    const [text, setText] = React.useState<string>("");
    const sendBtn = React.useRef<HTMLButtonElement>(null);
    const mediaContainer = React.useRef<HTMLDivElement>(null);
    const inputContainer = React.useRef<HTMLDivElement>(null);

    const [sendMessage] = useMutation(SEND_MESSAGE);
   
    const marginBottom = 31.5;
    const send = () => {
        sendMessage({variables: {id: cid, uid: user.id, text: text}})
        setText("");
    }

    return (
        <div className="fixed footer width-100 flex align-end justify-around" id="chat-footer">
            <AttachMessage style={{marginBottom: `${marginBottom + 6.5}px`}}/>
            <div className="chat-input-container flex align-end" ref={inputContainer}>
                <ChatInput 
                    value={text}
                    setValue={setText}
                    style={{marginBottom: `${marginBottom}px`}}
                    onChange={event => {
                        let mediaDisplay; let sendDisplay; let contWidth;
                        if (event.currentTarget.value.length === 0) {
                            sendDisplay = "none";
                            mediaDisplay = "flex";
                            contWidth = "calc(100% - 3*var(--font-size-icon) + 4px - 3*30px + 15px)";
                        } else {
                            sendDisplay = "flex";
                            mediaDisplay = "none";
                            contWidth = "calc(100% - var(--font-size-icon) + 4px - 30px)";
                        }

                        setWidth(inputContainer.current, contWidth);
                        
                        setDisplay(sendBtn.current, sendDisplay);
                        setDisplay(mediaContainer.current, mediaDisplay);
                    }}
                />
                <button 
                    ref={sendBtn} 
                    onClick={send}
                    className="icon-chat-send"
                    style={{display: "none", marginBottom: `${marginBottom + 6.5}px`}} 
                ></button>
            </div>
            <div ref={mediaContainer} className="flex align-center" style={{marginBottom: `${marginBottom + 6.5}px`}}>
                <ImageMessage />
                <VoiceMessage />
            </div>
        </div>  
    )
}

export default ChatFooter;