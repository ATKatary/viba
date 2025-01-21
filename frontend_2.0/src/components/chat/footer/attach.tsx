import * as React from "react";

import { IconButton } from "@mui/material";

interface AttachMessageProps extends React.PropsWithChildren<any> {
}
function AttachMessage(props: AttachMessageProps) {
    const {...domProps} = props;
    const {style, className, ...rest} = domProps;

    return (
        <button className={`icon-chat-attach ${className}`} style={{...style}}></button>
    )
}

export default AttachMessage;