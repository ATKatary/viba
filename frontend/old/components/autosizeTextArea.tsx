import * as React from "react";
import { styles } from "../../src/styles";
import { isMobile } from "../../src/utils";

interface AutosizeTextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    value: string 
    setValue: (value: string) => any
}

function AutosizeTextArea(props: AutosizeTextAreaProps) {
    const {value, setValue, ...domProps} = props; 
    const {style, className, onKeyUp, ...rest} = domProps;

    const [rows, setRows] = React.useState<number>(1);

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, value);

    return (
        <textarea 
            rows={rows}
            ref={textAreaRef}
            value={value || ""}
            placeholder="Type a message..."
            className={`flex align-center ${className}`}
            style={{width: "70%", padding: 0, ...style}} 
            onKeyUp={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (event.code === "Enter" && event.shiftKey && !isMobile) {
                    setRows(rows + 1)
                } else if (event.code === "Enter" && value) {
                    if (onKeyUp) onKeyUp(event);
                    setValue("");
                }
            }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value)}
        ></textarea>
    )
}

const useAutosizeTextArea = (textAreaRef: HTMLTextAreaElement | null, value: string) => {
    React.useEffect(() => {
        if (textAreaRef) {
            // We need to reset the height momentarily to get the correct scrollHeight for the textarea
            textAreaRef.style.height = "10px";
            const scrollHeight = textAreaRef.scrollHeight;
    
            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will product an incorrect value.
            textAreaRef.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, value]);
};


export default AutosizeTextArea;