/*** Notifications ***/
export type notificationType = {
    notify: boolean, 
    message: string, 
    
    error?: boolean, 
    success?: boolean
};

export type notificationContextType = {
    notification: notificationType, 
    setNotification: (notification: notificationType) => void
};

/*** Loading ***/
export type loadingType = {
    load: boolean
    message: string
}

export type loadingContextType = {
    loading: loadingType, 
    setLoading: (loading: loadingType) => void
};

/*** Utility ***/
export type interfaceStateType = {
    update?: boolean
    edited?: boolean
    watching?: boolean 
    initialized?: boolean
}
