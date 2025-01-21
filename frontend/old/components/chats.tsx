import * as React from "react";

import { Typography } from "@mui/material";

import { styles } from "../../src/styles";
import { chatType } from "../../src/types/chat";
import { userType } from "../../src/types/user";
import { COLORS, THEME } from "../../src/constants";
import { getTimeSentString, getChatPFP } from "../../src/utils/chats";
import { SizeContext, ThemeContext } from "../../src";
import { sizeContextType } from "../../src/types";
import { isMobile, setRootColor } from "../../src/utils";

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
    cid?: string 
    user?: userType
    chats: chatType[]

    onChatClick: (cid: string) => any
}

function Chats(props: ChatProps) {
    const {user, cid, chats, onChatClick, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    
    const theme = React.useContext(ThemeContext);
    const {sizes, setSizes} = React.useContext(SizeContext) as sizeContextType;
    
    const width = sizes.user.chats;
    React.useEffect(() => {
        if (isMobile) {
            setRootColor(THEME.BACKGROUND_ACCENT(theme?.isDark))
        }
    }, [])
    return ( 
        <div
            className={`height-100 flex column align-center ${className}`} 
            style={{
                width: width,
                // borderRight: `1px solid ${THEME.BACKGROUND_ACCENT_2(theme?.isDark)}`,
                ...style,
            }}
        >
            <div style={{height: 150}}></div>
            <div className="flex align-center column" style={{padding: 5, width: "calc(100% - 10px)"}}>
                {chats?.map(chat => {
                    const lastMessage = chat.messages.at(-1)
                    const pfp = user? getChatPFP(chat, user) : undefined;
                    const name = lastMessage?.sender.id === user?.id? "You" : lastMessage?.sender.name;
                    
                    return (
                        <div 
                            onClick={() => {
                                onChatClick(chat.id);
                                if (width === "100%") {
                                    setSizes({user: {openChat: "100%", chats: 0, sidebar: 0}})
                                }
                            }}
                            className="flex justify-between align-center pointer" 
                            style={{padding: 5, width: "calc(100% - 10px)", borderRadius: 5, backgroundColor: cid === chat.id? `${THEME.ACTIVE_ACCENT(theme?.isDark)}32` : COLORS.TRANSPARENT}}
                        >
                            <div className="flex align-center" style={{width: "calc(100% - 15px)"}}>
                                <img style={{...styles.userIcon(theme?.isDark)}} src={pfp}/>

                                {!(typeof width === "number" && width <= 100)?
                                    <div style={{marginLeft: 10, width: "calc(100% - 70px"}}>
                                        <Typography 
                                            className="text-overflow-ellipsis overflow-hidden"
                                            sx={{
                                                ...styles.chatButtonText(chat.unreadCount), 
                                                opacity: 1.0, 
                                                fontWeight: 400,
                                                fontSize: THEME.FONT.SUB_HEADING()
                                            }}
                                        >
                                            {chat.title}
                                        </Typography>
                                        <div className="flex align-center">
                                            <Typography sx={{...styles.chatButtonText(chat.unreadCount)}} className="flex align-center">
                                                <span className="text-overflow-ellipsis overflow-hidden" style={{maxWidth: 125, marginRight: 5}}>
                                                    {name === chat.title? "" : name? `${name}: ` : ""} {lastMessage?.text}
                                                </span> · {getTimeSentString(lastMessage)}
                                            </Typography>
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                            {chat.unreadCount? <div style={{...styles.unreadCircle(theme?.isDark) as React.CSSProperties}}></div> : <></>}
                        </div>
                    )
                })}
            </div>
            <div></div>
        </div>
    )
}

export default Chats;

