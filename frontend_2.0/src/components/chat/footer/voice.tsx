import * as React from "react";

interface VoiceMessageProps extends React.PropsWithChildren<any> {
}
function VoiceMessage(props: VoiceMessageProps) {
    const {...domProps} = props;
    const {style, className, ...rest} = domProps;
    
    return (
        <button className={`icon-chat-voice ${className}`} style={{...style}}></button>
    )
}

export default VoiceMessage;