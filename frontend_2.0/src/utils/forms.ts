import { REGEX } from "../constants";
import { signFormFieldType } from "../types/forms";

export function validateField(value: string): signFormFieldType {
    let message;
    if (!value) {
        message = "Invalid value"
    }
    return {value: value, message: message}
}

export function validateEmail(email: string): signFormFieldType {
    let message;
    if (!email || email.toLowerCase().match(REGEX.EMAIL) === null) {
        message = "Invalid email"
    }
    return {value: email, message: message}
}

export function validatePassword(password: string, confirmPassword?: string): signFormFieldType {
    let message;
    if (!password) {
        message = "Invalid password"
    } else if (password.length < 6) {
        message = "Password length < 6"
    } else if (confirmPassword && confirmPassword !== password) {
        message = "Password does not match"
    }

    return {value: confirmPassword || password, message: message}
}

export function validateUrl(url: string): signFormFieldType {
    let message;
    if (!/^https?:\/\/([\w-]+\.)+\w{2,}(\/.+)?$/.test(url)) {
        message = "Invalid url"
    }

    return {value: url, message: message}
}