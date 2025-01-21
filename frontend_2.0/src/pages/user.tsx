import * as React from "react";

import "../assets/css/user.css";

import { useLocation } from "react-router-dom";

import * as navTypes from "../types/nav";
import { useUser } from "../classes/user";

import Footer from "../components/footer";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

import Chat from "../components/chat";
import { sendPush } from "../api/viba";
import { registerSw } from "../workers/register";

interface UserProps extends React.PropsWithChildren<any> {
}
function User(props: UserProps) {
    const state = useLocation().state as navTypes.stateType;
    
    React.useEffect(() => {
        registerSw(state.id);
    }, [])
    
    const {user} = useUser(state.id);
    const [i, setI] = React.useState(0); // indicates which footer item is active
    const [j, setJ] = React.useState(-1); // indicated which chat is active
    const [openSettings, setOpenSettings] = React.useState(false);

    return (
        <div className="flex column align-center width-100 height-100">
            {user.obj && j === -1?
                <>
                <Header 
                    i={i}   
                    user={user.obj}
                    onSettings={() => setOpenSettings(!openSettings)}
                    title={i === 0? "Chats" : i === 1? "Calls" : "Pay"}
                />
                {i == 0?
                    <Sidebar 
                        i={j}
                        setI={setJ}
                        user={user.obj}
                        chats={user.obj?.chats || []} 
                    /> : <></>
                }
                <Footer 
                    i={i}
                    setI={setI}
                    items={[
                        {icon: "icon-chat", title: "Chats", onClick: () => setJ(-1)},
                        {icon: "icon-call", title: "Calls"},
                        {icon: "icon-pay", title: "Pay"},
                    ]}
                /> 
                </> : user.obj?
                    <Chat
                        i={j}
                        setI={setJ}
                        user={user.obj}
                        cid={user.obj.chats[j].id}
                    /> : <></>
            }
        </div>
    )
}

export default User;