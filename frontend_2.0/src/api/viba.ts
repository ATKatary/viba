import { post } from "../utils";

export async function uploadPFP(id?: string, file?: File) {
    const formData = new FormData();
    // const url = `http://127.0.0.1:8000/api/viba/user/upload_pfp`
    const url = `https://fabhous.com/api/viba/user/upload_pfp`
    if (!id || !file) return;
    
    formData.append("id", id);
    formData.append("pfp", file);
    return await post(url, formData, {});
}

export async function sendAttachments(cid?: string, uid?: string, text?: string, attachments?: File[]) {
    const formData = new FormData();
    // const url = `http://127.0.0.1:8000/api/viba/user/upload_pfp`
    const url = `https://fabhous.com/api/viba/chat/send_attachments`
    if (!cid || !uid || !attachments) return;

    formData.append("id", cid);
    formData.append("uid", uid);
    formData.append("text", text || "");
    for (let i = 0; i < attachments.length; i++) {
        formData.append(`attachment_${i}`, attachments[i]);
    }

    return await post(url, formData, {});
}

export async function sendPush(uid?: string, text?: string) {
    const formData = new FormData();
    // const url = `http://127.0.0.1:8000/api/viba/chat/send_push`
    const url = `https://fabhous.com/api/viba/chat/send_push`
    if (!uid || !text) return;

    formData.append("uid", uid);
    formData.append("text", text || "");

    return await post(url, JSON.stringify({
        uid: uid,
        text: text
    }), {'Content-Type': 'application/json'});
}