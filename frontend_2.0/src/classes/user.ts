import * as React from "react";
import { useQuery, useSubscription } from "@apollo/client";

import { userType } from "../types/user";
import { useCustomState } from "../utils";
import { messageType } from "../types/chat";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { UserInterface } from "../interfaces";
import { GET_USER } from "../graphql/queries/user";
import { WATCH_USER } from "../graphql/subscriptions/user";

export class User extends GenericClass<userType> implements UserInterface {}

export function useUser(id?: string) {
    const user = new User(id);
    
    [user.id, user.setId] = React.useState<string>();
    [user.obj, user.setObj] = React.useState<userType>();
    [user.state, user.setState] = useCustomState<interfaceStateType>({});

    const { error, refetch } = useQuery(GET_USER, {skip: true});
    const [notifications, setNotifications] = React.useState<messageType[]>([]);
    const userSubscription = useSubscription(WATCH_USER, {variables: {id: id}});

    React.useEffect(() => {
        if (!user.state.initialized) {
            user.setState({initialized: true});
            const getGymWrapper = async () => {
                if (id) {
                    user.setId(id);
                    const loadedUser = (await refetch({id: id})).data.user as userType
                    user.setObj(loadedUser);
                }
            }
            getGymWrapper()
        }
    }, [user.state])

    React.useEffect(() => {
        if (userSubscription?.data) {
            console.log("[User][useUser] (user) >>", userSubscription?.data.watchUser)
            user.setObj(userSubscription.data.watchUser);
        }
    }, [userSubscription.data])

    React.useEffect(() => {
        if (id !== user.id) {
            user.setState({initialized: false});
        }
    }, [id])

    return {user}
}

