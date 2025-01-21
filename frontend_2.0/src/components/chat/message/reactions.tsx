import * as React from "react";

interface ReactionsProps extends React.PropsWithChildren<any> {
    open: boolean
    onClick?: (reaction: string) => any
}
function Reactions(props: ReactionsProps) {
    const {open, ...domProps} = props;
    const {style, className, onClick, ...rest} = domProps;
    
    return (
        open?
            <div className="reactions-container width-100 flex align-center justify-around" style={{...style}}>
                <Emoji symbol={[0x1F44D]} onClick={onClick}/>
                <Emoji symbol={[0x2764, 0xFE0F]} onClick={onClick}/>
                <Emoji symbol={[0x1F602]} onClick={onClick}/>
                <Emoji symbol={[0x1F62E]} onClick={onClick}/>
                <Emoji symbol={[0x1F622]} onClick={onClick}/>
                <Emoji symbol={[0x1F64F]} onClick={onClick}/>
            </div>
        : <></>
    )
}

export default Reactions;


interface EmojiProps extends React.PropsWithChildren<any> {
    symbol: number[]
    onClick?: (reaction: string) => any
}
export function Emoji(props: EmojiProps) {
    const {symbol, ...domProps} = props;
    const {style, className, onClick, ...rest} = domProps;

    const emojiStr = String.fromCodePoint(...symbol);

    return (
        <span 
            onClick={() => onClick && onClick(emojiStr)}
            className={`reaction-emoji ${className || ""}`} 
            role="img"
        >
                {emojiStr}
        </span>
    )
}