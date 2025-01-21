import * as React from "react";
import { isMobile, setDisplay, setWidth } from "../../../utils";

interface ChatInputProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    value: string 

    setValue: (value: string) => any
}

function ChatInput(props: ChatInputProps) {
    const {value, setValue, ...domProps} = props; 
    const {style, className, onKeyUp, onChange, ...rest} = domProps;

    const [rows, setRows] = React.useState<number>(1);

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    React.useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "0";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${scrollHeight - 15}px`;
        }
    }, [textAreaRef, value])

    return (
        <textarea 
            rows={rows}
            ref={textAreaRef}
            style={{...style}}
            value={value || ""}
            placeholder="Message"
            className="chat-input"
            onKeyUp={event => {
                if (event.code === "Enter") {
                    setRows(rows + 1)
                }
            }}
            onChange={(event) => {
                let inputWidth; 
                if (event.target.value.length === 0) {
                    inputWidth = "100%"
                } else {
                    inputWidth = "calc(100% - var(--font-size-icon) - 20px)";
                }


                setWidth(textAreaRef.current, inputWidth);
                if (onChange) onChange(event)

                setValue(event.target.value)
            }}
        ></textarea>
    )
}

export default ChatInput;