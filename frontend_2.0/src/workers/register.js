import { getDevOrDepUrl, post, urlB64ToUint8Array } from '../utils';

export const registerSw = async (uid) => {
    if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('./sw.js');
        initialize(uid, reg)

    } else {
        showNotAllowed("You can't send push notifications ☹️😢")
    }
};

const initialize = (uid, reg) => {
    if (!reg.showNotification) {
        showNotAllowed('Showing notifications isn\'t supported ☹️😢');
        return
    }
    if (Notification.permission === 'denied') {
        showNotAllowed('You prevented us from showing notifications ☹️🤔');
        return
    }
    if (!'PushManager' in window) {
        showNotAllowed("Push isn't allowed in your browser 🤔");
        return
    }
    subscribe(uid, reg);
}

const showNotAllowed = (message) => {
    console.log(message)
};

const subscribe = async (uid, reg) => {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
        sendSubData(uid, subscription);
        return;
    }

    // const vapidMeta = document.querySelector('meta[name="vapid-key"]');
    const key = 'BM2KapHZjGt3stxGjlL7ct0OdhMLpNSAn4NqwPfpKJ1G7YJ4gVckrGRpbb6nDfY3ciWe-rSm88pqQCrsHbBnhjI';
    const options = {
        userVisibleOnly: true,
        // if key exists, create applicationServerKey property
        ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
    };

    const sub = await reg.pushManager.subscribe(options);
    sendSubData(uid, sub)
};

const sendSubData = async (uid, subscription) => {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        uid: uid,
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
    };

    const res = await post(`https://fabhous.com/api/viba/webpush/save_information`, JSON.stringify(data), {'Content-Type': 'application/json'});
    handleResponse(res);
};

const handleResponse = (res) => {
    console.log(res.status);
};
