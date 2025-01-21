import { DAYS } from "../constants";
import { userType } from "../types/user";
import { isToday, getYesterday } from ".";
import group from "../assets/media/chat/group.png";
import { chatType, messageType } from "../types/chat";

export function getTimeSentDateString(message?: messageType): string {
    if (!message) return "";
    const dateSent = new Date(message.timeSent);

    if (isToday(dateSent)) {
        const hourSent = dateSent.getHours()
        const minSent = dateSent.getMinutes()
        return `${hourSent > 12? hourSent - 12 : hourSent}:${minSent >= 10? minSent : `0${minSent}`} ${hourSent > 12? "PM" : "AM"}`
    } else if (isToday(dateSent, getYesterday())) {
        return `${DAYS[dateSent?.getDay()]}`;
    }

    return `${DAYS[dateSent?.getDay()]}, ${new Intl.DateTimeFormat("en-US", {
        year: dateSent.getFullYear() === new Date().getFullYear()? undefined : "numeric",
        month: "short",
        day: "2-digit"
      }).format(dateSent)}`;
}

export function getTimeSentTimeString(message?: messageType): string {
    if (!message) return "";
    const dateSent = new Date(message.timeSent);

    const hourSent = dateSent.getHours()
    const minSent = dateSent.getMinutes()
    return `${hourSent > 12? hourSent - 12 : hourSent}:${minSent >= 10? minSent : `0${minSent}`} ${hourSent > 12? "PM" : "AM"}`
}

export function isGroup(chat: chatType) {
    return ((chat?.members?.length || 0) + (chat?.admins?.length || 0)) > 2
}

export function getChatPFP(chat: chatType, user?: userType, uid?: string) {
    if (isGroup(chat)) {
        return group
    } 

    const members: userType[] = [...chat.admins, ...chat.members]
    for (const member of members) {
        if (
            (user && member.id !== user.id) ||
            (uid && member.id !== uid)
        ) return member.pfp
    }
}

export function isEmoji(text: string): boolean {
    const charRegex = /[a-zA-Z]/g;
    const regex = /\p{Extended_Pictographic}/ug;

    return regex.test(text) && !charRegex.test(text) && text.length <= 6
}

export function isMyMessage(message: messageType, user: userType) {
    return message.sender.id === user.id
}

export function splitMessagesBySender(messages: messageType[]): messageType[][] {
    const buckets: messageType[][] = [];

    for (const message of messages) {
        if (buckets.length === 0) {
            buckets.push([message]) 
        } else {
            !isMyMessage(buckets[buckets.length - 1][0], message.sender)? buckets.push([message]) : buckets[buckets.length - 1].push(message)
        }
    }
    return buckets;
}

export function splitMessagesByDay(messages : messageType[]): messageType[][] {
    const buckets: messageType[][] = [];

    let today: Date | undefined;
    for (const message of messages) {
        if (!today || !isToday(new Date(message.timeSent), today)) {
            buckets.push([message]);
            today = new Date(message.timeSent);
        } else {
            buckets[buckets.length - 1].push(message);
        }
    }
    return buckets
}