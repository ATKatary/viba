import * as types from "../types";
import * as Mui from "@mui/material";

interface NotificationProps extends React.PropsWithChildren<any> {
    notification: types.notificationType
    setNotification: (notification: types.notificationType) => void

    duration?: number
    vertical?: "top" | "bottom" 
    horizontal?: "center" | "right" | "left" 
}
export function Notification(props: NotificationProps) {
    const {duration, notification, setNotification, vertical, horizontal} = props;

    const {message, notify} = notification;
    const handleClose = () => setNotification({message: "", notify: false})

    return (
        <Mui.Snackbar 
            open={notify}
            message={message}
            onClose={handleClose}
            autoHideDuration={duration}
            style={{maxWidth: 400, maxHeight: 200}}
            className="overflow-hidden text-overflow-ellipsis notification"
            anchorOrigin={{
                vertical: vertical || "top", 
                horizontal: horizontal || "right"
            }}
        />
    )
}