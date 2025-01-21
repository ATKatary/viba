import * as React from "react";
import { useLocation } from "react-router-dom";

import Video from "./components/video";
import Chats from "./components/chats";
import { stateType } from "../src/types/nav";
import { useUser } from "../src/classes/user";
import { useCall } from "../src/classes/call";
import { sizeContextType } from "../src/types";
import Sidebar from "./components/sidebar";
import OpenChat from "./components/openChat";
import { SizeContext, ThemeContext } from "../src";
import { requestPermission, showNotification } from "../src/api/notification";

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
}

function User(props: UserProps) {
    const {...domProps} = props;
    const state = useLocation().state as stateType;
    const {sizes, setSizes} = React.useContext(SizeContext) as sizeContextType;

    const widths = sizes.user;
    const {user} = useUser(state?.id);
    const {call} = useCall(state.id, "video");
    const [cid, setCid] = React.useState<string>();

    const theme = React.useContext(ThemeContext)
    window.onbeforeunload = (event) => {
        call.leave();
    }

    return ( 
        <div style={{}} className="width-100 flex height-100">
            <Sidebar 
                user={user.obj} 
                style={{width: widths.sidebar, display: widths.sidebar? "" : "none"}}
            />
            <Chats 
                cid={cid}
                user={user.obj}
                chats={user.obj?.chats || []}
                onChatClick={(cid: string) => setCid(cid)}
                style={{display: widths.chats? "" : "none", backgroundColor: "var(--bs-sidebar-sub-bg)"}}
            />
            {cid && user.obj? 
                <OpenChat 
                    cid={cid} 
                    call={call}
                    user={user.obj} 
                    style={{width: widths.openChat}} 
                    closeChat={() => setCid(undefined)}
                /> : <></>
            }
            <Video call={call} /> 
        </div>
    )
}

export default User;