import * as React from "react";

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import "../../assets/css/sidebar.css";

import { chatType } from "../../types/chat";
import ChatThumbnail from "../chat/thumbnail";
import { userType } from "../../types/user";

interface SidebarProps extends React.PropsWithChildren<any> {
    i: number
    user: userType
    setI: (i: number) => void

    chats: chatType[]
}
function Sidebar(props: SidebarProps) {
    const {user, i, setI, chats, ...domProps} = props; 
    const {style, className, ...rest} = domProps;
    
    return (
        <div className="sidebar width-100 scroll">
            <div className="sidebar-content flex column align-center">
                <div 
                    className="sidebar-search flex align-center" 
                >
                    <SearchRoundedIcon className="sidebar-search-icon"/>
                    <input 
                        className="sidebar-search-input" 
                        placeholder="Search"
                    />
                </div> 
                {chats.map((chat, j) => {
                    const active = i === j;
                    
                    return (
                        <ChatThumbnail
                            active 
                            user={user}
                            chat={chat} 
                            key={chat.id} 
                            onClick={() => setI(j)}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar;