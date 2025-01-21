import * as React from "react";

import { Typography } from "@mui/material";

import { ThemeContext } from "../../../src";
import { styles } from "../../../src/styles";
import { isEmoji } from "../../../src/utils/chats";
import { COLORS, THEME } from "../../../src/constants";

interface MessageTextProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    text: string
    mine: boolean
}

function MessageText(props: MessageTextProps) {
    const {text, mine, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    const theme = React.useContext(ThemeContext);
    
    const lines = React.useMemo(() => text.split("\n").filter(line => "\r" !== line), [text]);

    return (
        lines.length > 1?
        <div
            className={`flex align-center ${className || ""}`} 
            style={{
                ...styles.message(theme?.isDark, mine, isEmoji(text)),
            }}
        >
            <Typography 
                style={{
                    fontSize: isEmoji(text)? "xxx-large" : THEME.FONT.PARAGRAPH()
                }}
                color={mine? COLORS.WHITE : "#000"} 
            >
                {lines?.map((line, i) => i < lines.length - 1? <>{line}<br></br></> : <></>)}
            </Typography>
        </div> : <></>
    )
}

export default MessageText;