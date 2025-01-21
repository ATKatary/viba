import * as React from "react";

interface ImageMessageProps extends React.PropsWithChildren<any> {
}
function ImageMessage(props: ImageMessageProps) {
    const {...domProps} = props;
    const {style, className, ...rest} = domProps;
    
    return (
        <button className={`icon-chat-img ${className}`} style={{...style}}></button>
    )
}

export default ImageMessage;