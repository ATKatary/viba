import * as React from "react";
import { SxProps, Typography } from "@mui/material";

interface ChatIconProps extends React.PropsWithChildren<any> {
    src?: string
}
function ChatIcon(props: ChatIconProps) {
    const {src, ...domProps} = props;
    const {className, style, ...rest} = domProps;

    return (
        <img 
            src={src} 
            style={{...style}}
            className={`chat-icon circle ${className}`} 
        />
    )
}

export default ChatIcon;