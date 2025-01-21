import { Divider } from "@mui/material";
import * as React from "react";
import { messageType } from "../../../types/chat";
import { useMutation } from "@apollo/client";
import { DELETE_MESSAGE, EDIT_MESSAGE } from "../../../graphql/mutations/message";
import { NotificationContext } from "../../..";

interface ActionsProps extends React.PropsWithChildren<any> {
    open: boolean
    mine?: boolean
    message?: messageType
    setOpen: (open: boolean) => any
}
function Actions(props: ActionsProps) {
    const {mine, message, open, setOpen, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    
    const notification = React.useContext(NotificationContext);

    const [editMessage] = useMutation(EDIT_MESSAGE)
    const [deleteMessage] = useMutation(DELETE_MESSAGE)

    const actions = [
        {title: "Reply", icon: "icon-reply", onClick: () => console.log("reply")},
        {title: "Edit", icon: "icon-edit", onClick: () => {
            console.log("edit")
        }},
        {title: "Copy", icon: "icon-copy", onClick: () => {
            if (message) {
                navigator.clipboard.writeText(message.text)
                notification?.setNotification({message: "Copied!", notify: true})
            }
        }},
        {
            mine: true,
            title: "Delete", 
            icon: "icon-delete", 
            style: {color: "var(--danger)"}, 
            onClick: async () => {
                if (mine) {
                    await deleteMessage({variables: {id: message?.id}})
                }
            }
        },
    ]

    return (
        open?
            <div className="actions-container width-100" style={{...style}}>
                {actions.map((action, i) => {
                    if (action.mine && !mine) return <></>;
                    const addDivider = (i < actions.length - 1) && ((actions[i + 1].mine && mine) || (!actions[i + 1].mine))

                    return (
                        <div className="action width-100">
                            <div 
                                style={{...action.style}} 
                                onClick={() => {
                                    if (action.onClick) action.onClick()
                                    setOpen(false)
                                }}
                            >
                                <p className="action-title">{action.title}</p>
                                <i className={`${action.icon}`}></i>
                            </div>
                            {addDivider? <Divider orientation="horizontal" className="action-divider"></Divider> : <></>}
                        </div>
                    );
                })}
            </div>
        : <></>
    )
}

export default Actions;