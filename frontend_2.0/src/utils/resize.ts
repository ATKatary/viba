const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


/**
 * Wraps functions to collapse / un-collapse on resizing of window 
 * 
 * @param callback function expected to be run
 * @param setCollapse hook to handle changing collapse state 
 * @param width of the current window
 * @param orientation portrait or landscape
 * @returns a callback to first execute the callback then un-=-collapse
 */
export function dynamicResizeCallbackWrapper(callback: CallableFunction, setCollapse: CallableFunction, width?: number, orientation?: string) {
    return (args: any) => {
        callback(args);
        if (!resize(width, orientation)) setCollapse(true)
    }
}

/***
 * Checks if website should be dynamically resized to width > widthBreakpoint
 * @returns true if width > widthBreakpoint and orientation is landscape else false
 */
export function resize(width: number | undefined, orientation: string | undefined): boolean {
    if (width && orientation) return width > 800 && (isMobile? orientation.includes("landscape") : true);
    return false;
}