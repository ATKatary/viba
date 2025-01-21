import * as React from "react";

import { IconButton, SpeedDial, SpeedDialAction, Typography } from "@mui/material";

import CancelIcon from '@mui/icons-material/Cancel';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

import Message from "./message";
import { styles } from "../../src/styles";
import { COLORS, THEME } from "../../src/constants";
import { chatType } from "../../src/types/chat";
import AutosizeTextArea from "./autosizeTextArea";
import { useChat } from "../../src/classes/chat";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../src/mutations";
import { Call } from "../../src/classes/call";
import { getChatPFP, isGroup } from "../../src/utils/chats";
import { SizeContext, ThemeContext } from "../../src";
import { sizeContextType } from "../../src/types";
import { isMobile, setRootColor } from "../../src/utils";
import { sendAttachments } from "../../src/api/viba";
import { userType } from "../../src/types/user";
import { MessageAttachments } from "./message/attachment";

interface OpenChatProps extends React.HTMLAttributes<HTMLDivElement> { 
    call: Call
    cid: string
    user: userType
    closeChat: () => any
}

function OpenChat(props: OpenChatProps) {
    const {closeChat, call, user, cid, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    const themes = require.context("../assets/media/chatThemes", true);

    const {chat} = useChat(cid, user.id);
    const theme = React.useContext(ThemeContext);
    const messagesRef = React.useRef<HTMLDivElement>(null);
   
    const {sizes, setSizes} = React.useContext(SizeContext) as sizeContextType;
    
    const [sendMessage] = useMutation(SEND_MESSAGE);
    const [attachments, setAttachments] = React.useState<File[]>([]);
    const [attachmentContainerHeight, setAttachmentContainerHeight] = React.useState<number>(0);

    const footerBottom = React.useMemo(() => isMobile? 30 : 5, [sizes.user.openChat])

    React.useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }, [chat.obj?.messages])

    React.useEffect(() => {
        if (isMobile) {
            setRootColor(theme?.isDark? "#505050" : "#C4C4C4")
        }
    }, [])

    React.useEffect(() => {
        if (attachments.length) {
            setAttachmentContainerHeight(100)
        } else {
            setAttachmentContainerHeight(0)
        }
    }, [attachments])
    return ( 
        <div
            className={`height-100 width-100 flex column no-scrollbar justify-end ${className}`} 
            style={{backgroundColor: theme?.isDark? "#505050" : "#C4C4C4", ...style, boxShadow: "0 2px 4px rgba(15,34,58,.12)"}}
        >
            <div 
                className="width-100 height-100 fixed"
                style={{...style, ...styles.openChatBackground(themes("./whale/icon.png"))}}
            >
            </div>
            <OpenChatHeader chat={chat?.obj} {...props}/>
            
            <div 
                ref={messagesRef}
                className="flex column scroll width-100 no-scrollbar" 
                style={{maxHeight: `calc(100% - ${57 + attachmentContainerHeight + footerBottom}px)`, zIndex: 1, position: "relative", bottom: 57 + attachmentContainerHeight + footerBottom}}
            >
                <div className="width-100" style={{minHeight: 56}}></div>
                {chat?.obj?.messages.map((message, i) => {
                    return (
                        <Message 
                            user={user}
                            key={message.id} 
                            message={message} 
                            isGroup={chat.obj? isGroup(chat.obj) : false}
                            prevSender={chat.obj?.messages[i - 1]?.sender}
                        />
                    )
                })}
            </div>
            <OpenChatFooter 
                attachments={attachments}
                footerBottom={footerBottom}
                attachmentContainerHeight={attachmentContainerHeight}

                onRemove={(file) => {
                    setAttachments(attachments.filter(f => f !== file))
                }}

                onAttach={(file) => {
                    setAttachments([...attachments, file]);
                }}

                onEnter={(text) => {
                    if (attachments.length){
                        sendAttachments(cid, user.id, text, attachments)
                        setAttachments([])
                    } else {
                        sendMessage({variables: {id: cid, uid: user.id, text: text}})
                    }
                }} 

                onThumbsUp={() => {
                    sendMessage({variables: {id: cid, uid: user.id, text: "🐳\n"}})
                }} style={{...style}}
            />
        </div>
    )
}

export default OpenChat;

interface OpenChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> { 
    call: Call
    uid?: string 
    chat?: chatType
    closeChat: () => any
}
function OpenChatHeader(props: OpenChatHeaderProps) {
    const {closeChat, call, uid, chat, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const theme = React.useContext(ThemeContext);
    const {sizes, setSizes} = React.useContext(SizeContext) as sizeContextType;
    
    const open = React.useMemo(() => chat?.id && call.open && (call.callerCid === chat.id), [call.open, call.callerCid, chat?.id])

    return (chat?.id?
        <div 
            style={{...styles.openChatHeader(theme?.isDark), ...style}} 
            className={`fixed flex align-center justify-between ${className || ""}`}
        >
            <div className="flex align-center">
                {sizes.user.openChat === "100%"?
                    <IconButton onClick={() => {
                        closeChat()
                        setSizes({user: {chats: "100%", openChat: 0, sidebar: 0}})
                    }}>
                        <ArrowBackIosRoundedIcon style={{width: 25, height: 25, color: "#AB0F07"}}/>
                    </IconButton> : <></>
                }
                <img style={{...styles.userIcon(theme?.isDark, 30), marginLeft: 10, backgroundColor: "#AB0F07"}} src={getChatPFP(chat, undefined, uid)}/>
                <Typography 
                    className="text-overflow-ellipsis overflow-hidden"
                    sx={{...styles.chatButtonText(), opacity: 1.0, marginLeft: "10px", maxWidth: isMobile? 150 : 200}}
                >
                    {chat?.title}
                </Typography>
            </div>
            <div>
                <IconButton style={{marginRight: 5, padding: 2}}>
                    <LocalPhoneIcon style={{width: 25, height: 25, color: "#AB0F07"}}/>
                </IconButton>
                <IconButton 
                    style={{marginRight: 5, ...styles.joinVideoButton(theme?.isDark, open), padding: 2}} 
                    onClick={() => {
                        if (open) call.join(chat.id);
                        else call.start(chat.id);
                    }}
                >
                    <VideocamIcon style={{width: 25, height: 25, margin: "-2px 5px 0 0", color: open? THEME.BACKGROUND_ACCENT(theme?.isDark) : "#AB0F07"}}/>
                    {open? 
                        <Typography sx={{fontSize: THEME.FONT.PARAGRAPH(), color: THEME.BACKGROUND_ACCENT(theme?.isDark)}}>Join</Typography>
                        : <></>
                    }
                </IconButton> 
                <IconButton style={{marginRight: 5, padding: 2}}>
                    <MoreHorizRoundedIcon style={{width: 25, height: 25, color: "#AB0F07"}}/>
                </IconButton>
            </div>
        </div>
        : <></>
    )
}


interface OpenChatFooterProps extends React.HTMLAttributes<HTMLDivElement> { 
    attachments: File[]
    footerBottom: number
    attachmentContainerHeight: number

    onThumbsUp: () => any 
    onRemove: (file: File) => any
    onEnter: (text: string) => any 
    onAttach: (file: File) => any 
}
function OpenChatFooter(props: OpenChatFooterProps) {
    const {attachments, attachmentContainerHeight, footerBottom, onEnter, onThumbsUp, onAttach, onRemove, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const theme = React.useContext(ThemeContext);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const actions = [
        { icon: InsertDriveFileIcon, name: 'attachment', onClick: () => inputRef?.current?.click()},
        { icon: KeyboardVoiceIcon, name: 'voice message', onClick: () => {}},
    ];

    const [text, setText] = React.useState<string>("");
    return (
        <div style={{...styles.openChatFooter(), ...style, bottom: footerBottom}} className="width-100 fixed flex align-end justify-center">
            <input ref={inputRef} style={{display: 'none'}} type="file" onChange={(event) => {
                const files = event.target.files
                if (files) onAttach(files[0]);
                event.target.value = ""
            }} />
            <SpeedDial
                ariaLabel="chat-speed-dial" 
                style={{marginLeft: -10}}
                FabProps={{sx: {...styles.chatSpeedDial()}}}
                icon={<AddCircleIcon style={{width: 30, height: 30, color: "#AB0F07"}}/>}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        onClick={action.onClick}
                        tooltipTitle={action.name}
                        icon={<action.icon style={{width: 20, height: 20}}/>}
                        sx={{width: 30, height: 30, minHeight: 30, maxHeight: 30, color: "#AB0F07"}}
                    />
                ))}
            </SpeedDial>
            <div 
                className="flex column align-center width-100"
                style={{...styles.openChatInputContainer(theme?.isDark)}}
            >
                <MessageAttachments
                    preview
                    onRemove={onRemove}
                    attachments={attachments}
                    attachmentStyle={{
                        ...styles.openChatAttachment(theme?.isDark, 100), 
                        objectFit: "cover",
                    }}
                    style={{...styles.openChatAttachmentContainer(theme?.isDark), height: attachmentContainerHeight}}
                    className="flex"
                />
                <AutosizeTextArea
                    value={text}
                    setValue={setText} 
                    onKeyUp={(event) => onEnter(text)}
                    style={{...styles.openChatInput(theme?.isDark)}}
                />
            </div>
            <Typography onClick={onThumbsUp} className="pointer" style={{marginBottom: 0, fontSize: THEME.FONT.HEADING()}}>🐳</Typography>
        </div>
    )
}

