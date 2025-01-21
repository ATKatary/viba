import * as React from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import { chatType } from "../types/chat";
import { useCustomState } from "../utils";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { ChatInterface } from "../interfaces";
import { GET_CHAT } from "../graphql/queries/chat";
import { READ_CHAT } from "../graphql/mutations/chat";
import { WATCH_CHAT } from "../graphql/subscriptions/chat";

export class Chat extends GenericClass<chatType> implements ChatInterface {}

export function useChat(id?: string, uid?: string) {
    const chat = new Chat(id);
    
    [chat.id, chat.setId] = React.useState<string>();
    [chat.obj, chat.setObj] = React.useState<chatType>();
    [chat.state, chat.setState] = useCustomState<interfaceStateType>({});

    const [readChat] = useMutation(READ_CHAT);
    const { error, refetch } = useQuery(GET_CHAT, {skip: true});
    const chatSubscription = useSubscription(WATCH_CHAT, {variables: {id: id, uid: uid}});

    React.useEffect(() => {
        if (!chat.state.initialized) {
            chat.setState({initialized: true});
            const getChatWrapper = async () => {
                if (id && uid) {
                    chat.setId(id);
                    await readChat({variables: {id: id, uid: uid}});
                    const loadedChat = (await refetch({id: id, uid: uid})).data.chat as chatType
                    chat.setObj(loadedChat);
                }
            }
            getChatWrapper()
        }
    }, [chat.state])

    React.useEffect(() => {
        if (chatSubscription?.data) {
            readChat({variables: {id: id, uid: uid}});
            console.log("[Chat][useChat] (chat) >>", chatSubscription?.data.watchChat)
            chat.setObj(chatSubscription.data.watchChat);
        }
    }, [chatSubscription.data])

    React.useEffect(() => {
        if (id !== chat.id) {
            chat.setState({initialized: false});
        }
    }, [id])

    return {chat}
}

