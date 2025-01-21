import * as React from "react";

import "../../assets/css/chat.css";

import Message from "./message";
import ChatHeader from "./header";
import ChatFooter from "./footer";
import { makeId } from "../../utils";
import { userType } from "../../types/user";
import { chatType } from "../../types/chat";
import { useChat } from "../../classes/chat";
import { getTimeSentDateString, splitMessagesByDay, splitMessagesBySender } from "../../utils/chats";

interface ChatProps extends React.PropsWithChildren<any> {
    i: number // selected chat index
    setI(i: number): void // set selected chat index

    cid: string
    user: userType
}
function Chat(props: ChatProps) {
    const {i, setI, cid, user, ...domProps} = props;

    const {chat} = useChat(cid, user.id);

    const messageContainer = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (messageContainer.current) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
        }
    }, [chat, messageContainer.current]);

    return (
        chat.obj? 
            <div className="width-100 height-100">
                <ChatHeader i={i} setI={setI} chat={chat.obj} user={user}/> 
                <div className="sidebar width-100 scroll" ref={messageContainer}>
                    <div className="sidebar-content flex column align-center justify-end">
                        {splitMessagesByDay(chat.obj.messages).map(day => {
                            return (
                                <div className="flex align-center column width-100" key={makeId(9)}>
                                    <div className="chat-sent-date">{getTimeSentDateString(day[0])}</div>
                                    {splitMessagesBySender(day).map(messages => {
                                        return (
                                            <Message
                                                user={user}
                                                messages={messages} 
                                                key={messages[0].id} 
                                            />
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <ChatFooter cid={cid} user={user}/>
            </div>
            : <></>
    )
}

export default Chat;