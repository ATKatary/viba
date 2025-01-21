import * as React from "react";

import { Button } from "@mui/material";

import "../assets/utils.css";

import { NotificationContext } from "..";
import { useCustomState} from "../utils";
import { useAuth } from "../context/auth";
import { signupFormType } from "../types/forms";
import { FormField, PassFormField } from "../forms/fields";
import { validateEmail, validateField, validatePassword } from "../utils/forms";
import VibaStyleSheet from "../styles";

interface SignupProps extends React.HTMLAttributes<HTMLDivElement> {
}

function SignupForm(props: SignupProps) {
    const {...domProps} = props;
    const {style, className, ...rest} = domProps; 
    
    const auth = useAuth();
    const notification = React.useContext(NotificationContext);

    const [form, setForm] = useCustomState<signupFormType>({});

    const validate = (): boolean => {
        setForm({
            email: validateEmail(form.email?.value),
            lastName: validateField(form.lastName?.value),
            firstName: validateField(form.firstName?.value),

            password: validatePassword(form.password?.value),
            confirmPassword: validatePassword(form.password?.value, form.confirmPassword?.value),
        })
        return true;
    }

    const signup = async () => {
        if (validate() && form.email && form.password) {
            const uid = await auth?.signup(form.email?.value, form.password?.value);

            if (uid?.message === "Firebase: Error (auth/email-already-in-use).") {
                notification?.setNotification({message: "Email already in use.", notify: true});
                return;
            } else {
                // signup user and redirect
            }
        }
    }

    return (
        <>
            <FormField 
                className="form-field"
                placeholder="First name"
                sx={{...VibaStyleSheet.form.field}} 
                value={form.firstName?.value || ""}
                InputProps={{className: "form-input"}}
                helperText={form.firstName?.message || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({firstName: validateField(event.target.value)})}
            />

            <FormField 
                className="form-field"
                placeholder="Last name"
                value={form.lastName?.value || ""}
                sx={{...VibaStyleSheet.form.field}} 
                InputProps={{className: "form-input"}}
                helperText={form.lastName?.message || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({lastName: validateField(event.target.value)})}
            />

            <FormField 
                placeholder="Email"
                className="form-field"
                value={form.email?.value || ""}
                sx={{...VibaStyleSheet.form.field}} 
                InputProps={{className: "form-input"}}
                helperText={form.email?.message || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>   setForm({email: validateEmail(event.target.value)})}
            />

            <PassFormField 
                className="form-field"
                placeholder="Password"
                sx={{...VibaStyleSheet.form.field}} 
                value={form.password?.value || ""}
                InputProps={{className: "form-input"}}
                helperText={form.password?.message || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({password: validatePassword(event.target.value)})}
            />
            
            <PassFormField 
                className="form-field"
                placeholder="Confirm password"
                sx={{...VibaStyleSheet.form.field}} 
                InputProps={{className: "form-input"}}
                value={form.confirmPassword?.value || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperText={form.confirmPassword?.message || ""}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({confirmPassword: validatePassword(form.password.value, event.target.value)})}
            />
    
            <Button 
                onClick={signup}
                className="form-btn-outlined absolute"
                sx={{...VibaStyleSheet.form.outlinedBtn, marginTop: "25px", bottom: "20%"}} 
            >{
                "Sign up"
            }</Button>
        </>
    )
}

export default SignupForm;
