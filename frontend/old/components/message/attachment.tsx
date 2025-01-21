import * as React from "react";

import CancelIcon from '@mui/icons-material/Cancel';

import { ThemeContext } from "../../../src";
import { THEME } from "../../../src/constants";
import { attachmentType } from "../../../src/types/chat";
import { Button, IconButton } from "@mui/material";
import { downloadURI, getExtension, isImage, isMobile } from "../../../src/utils";

interface MessageAttachmentsProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    preview?: boolean
    onRemove?: (file: File) => any
    attachments: attachmentType[] | File[]

    attachmentClassName?: string
    attachmentStyle?: React.CSSProperties
}

export function MessageAttachments(props: MessageAttachmentsProps) {
    const {preview, attachments, onRemove, ...domProps} = props;
    const {style, attachmentStyle, className, attachmentClassName, ...rest} = domProps
    const theme = React.useContext(ThemeContext);

    const attachmentsComponents = attachments.map(attachment => {
        return (
            <MessageAttachment 
                {...rest}
                preview={preview}
                onRemove={onRemove}
                attachment={attachment}
                style={attachmentStyle}
                className={attachmentClassName}
            />
        )
    })
    return (
        attachments.length?
            style?
                <div style={{...style}} className={`${className}`}>
                    {attachmentsComponents}
                </div> : <>{attachmentsComponents}</>
            : <></>
    )
}


interface MessageAttachmentProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    preview?: boolean
    onRemove?: (file: File) => any
    attachment: attachmentType | File
}

export function MessageAttachment(props: MessageAttachmentProps) {
    const {preview, attachment, onRemove, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const theme = React.useContext(ThemeContext);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const download = () => {
        if (!(attachment instanceof File)) {
            downloadURI(attachment.fileUrl, attachment.fileUrl.split("/").at(-1) || "file")
        }
    }

    React.useEffect(() => {
        if (attachment instanceof File) {
            const reader = new FileReader()
    
            reader.addEventListener("load", () => {
                if (imgRef.current) imgRef.current.src = reader.result as string;
            }, false);
            
            reader.readAsDataURL(attachment);
        }
    }, [attachment])

    return (
        <div>
            {preview?
                <IconButton 
                    style={{margin: "0 0 0 70px", position: "fixed"}}
                    onClick={() => (onRemove && attachment instanceof File)? onRemove(attachment) : null}
                >
                    <CancelIcon style={{width: 20, height: 20, color: THEME.ERROR(theme?.isDark)}}/> 
                </IconButton> : <></>
            }

            {isImage(attachment)?
                <img 
                    ref={imgRef}
                    className={`${className || ""}`}
                    style={{...style, objectFit: preview? "cover" : "contain"}} 
                    src={!(attachment instanceof File)? attachment.imageUrl : ""}
                />
                : 
                <Button
                    disabled={preview}
                    onClick={download} 
                    style={{...style, color: THEME.BACKGROUND_ACCENT(theme?.isDark)}}
                    className={`text-overflow-ellipsis overflow-hidden flex align-center justify-center ${className}`}
                >
                    {getExtension(attachment)}
                </Button>
            }
        </div>
    )
}