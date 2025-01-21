import * as React from "react";
import { API } from "../constants";
import { attachmentType } from "../types/chat";

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function nullify(obj: any) {
    if (!obj) return obj
    return JSON.parse(JSON.stringify(obj))
}

export function useCustomState<T>(initialState: any): [T, (newState: any) => any] {
    const [state, setState] = React.useState(initialState);
    const setCustomSate = (newState: any) => {
        setState((prevState: any) => ({...prevState, ...newState}))
    };
    
    return [state, setCustomSate];
}

export async function post(url: RequestInfo | URL, body: any, headers: HeadersInit, other?: any) {
    return await fetch(url, {
        method: API.POST,
        headers: {
            // 'Content-Type': API.APPLICATION_JSON,
            ...headers
        },
        credentials: 'same-origin',
        body: body,
        ...other
    })
}

export async function get(url: string, args: Object, headers: HeadersInit) {
    url += "?";
    for (const [arg, value] of Object.entries(args)) {
        url += `${arg}=${value}&`
    }

    return await fetch(url, {
        method: API.GET,
        headers: {
            'Content-Type': API.APPLICATION_JSON,
            ...headers
        },
    })
}

export function addToLocalStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        clearLocalStorage();
        localStorage.setItem(key, value);
    }
}

export function clearLocalStorage() {
    const permanent = ["sybSchedule", "nowPlaying", "currentLocationId"];
    const n = localStorage.length;

    for (let i = 0; i < n; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (permanent.includes(key)) continue;
        localStorage.removeItem(key);
    }
}

export function getDevOrDepUrl(urlToGet: "viba" | "user" | "webpush"): string {
    let prefix = "";
    const appName = "viba";
    if (window.location.hostname === "fabhous.com") {
        // if (localStorage.getItem("fabAuthenticatedFor") !== appName) {window.location.href = "/"; return "/"}
        prefix += "/" + appName
    }

    switch (urlToGet) {
        case "viba": return prefix + "/"
        case "user": return prefix + "/user"
        case "webpush": return prefix + "/webpush"
        default: break;
    }
    return prefix + "/"
}

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, i) => {
        return i === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function makeId(n: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function getYesterday(today = new Date()): Date {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

export function isToday(date: Date, today = new Date()): boolean {
    return (
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()
    )
}

export function isThisWeek(date: Date): boolean {
    const now = new Date();
  
    const weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
    const monthDay = now.getDate();
    const mondayThisWeek = monthDay - weekDay;
  
    const startOfThisWeek = new Date(+now);
    startOfThisWeek.setDate(mondayThisWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);
  
    const startOfNextWeek = new Date(+startOfThisWeek);
    startOfNextWeek.setDate(mondayThisWeek + 7);
  
    return date >= startOfThisWeek && date < startOfNextWeek;
}

export function setTheme(name: string) {
    addToLocalStorage("theme", name);
    document.documentElement.className = name;
}

export function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
}

export function isImage(file: File | attachmentType): boolean {
    if (file instanceof File) {
        return file?.type.startsWith("image") 
    } else {
        return file.imageUrl?.length > 0
    }
}

export function getExtension(file: File | attachmentType): string | undefined {
    if (file instanceof File) {
        return file?.type.split("/").at(-1)
    } else {
        return file.fileUrl?.split(".").at(-1)
    }
}

export function setDisplay(element: HTMLElement | null, display: string) {
    if (element) {
        element.style.display = display
    }
}

export function setWidth(element: HTMLElement | null, width: string) {
    if (element) {
        element.style.width = width
    }
}

export function urlB64ToUint8Array(base64String: string | any[]) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

    return outputData;
}