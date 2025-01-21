import * as React from "react";

import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import "../assets/utils.css";
import "../assets/css/form.css";

import { NotificationContext } from "..";
import { useAuth } from "../context/auth";
import { signinFormType } from "../types/forms";
import { getDevOrDepUrl, useCustomState} from "../utils";
import { FormField, PassFormField } from "../forms/fields";
import { validateEmail, validatePassword } from "../utils/forms";
import VibaStyleSheet from "../styles";

interface SigninProps extends React.HTMLAttributes<HTMLDivElement> {
}

function SigninForm(props: SigninProps) {
    const {...domProps} = props;
    const {style, className, ...rest} = domProps; 

    const auth = useAuth();
    const navigate = useNavigate();
    const notification = React.useContext(NotificationContext);

    const [form, setForm] = useCustomState<signinFormType>({});
    const [resetPass, setResetPass] = React.useState<boolean>(false);
    const [forgotPass, setForgotPass] = React.useState<boolean>(false);

    const validate = (): boolean => {
        setForm({
            email: validateEmail(form.email?.value),
            password: validatePassword(form.password?.value),
        })
        return true;
    }

    const signin = async () => {
        if (forgotPass) {
            auth?.sendResetPasswordEmail(form.email?.value);
        } else if (resetPass) {
            await auth?.updatePassword(form.password?.value);
        } else if (validate()) {
            const uid = await auth?.login(form.email?.value, form.password?.value);

            if (uid?.message === "Firebase: Error (auth/email-already-in-use).") {
                notification?.setNotification({message: "Email already in use.", notify: true});
                return;
            } else {
                await auth?.login(form.email?.value, form.password?.value)
            }
        }
    }

    React.useEffect(() => {
        const checkResetPassWrapper = async () => {
            const needsPassChange = await auth?.needsPasswordChange()
            if (needsPassChange) { 
                setResetPass(needsPassChange)
            } else if (auth?.id) {
                navigate(getDevOrDepUrl("user"), {state: {id: auth?.id}})
            }
        }
        checkResetPassWrapper()
    }, [auth?.isAuthenticated])

    return (
        <>
        {!resetPass?
            <FormField 
                placeholder="Email"
                className="form-field"
                value={form.email?.value || ""}
                sx={{...VibaStyleSheet.form.field}} 
                InputProps={{className: "form-input"}}
                helperText={form.email?.message || ""}
                inputStyle={{...VibaStyleSheet.form.input}}
                helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({email: validateEmail(event.target.value)})}
            />
            : <Typography style={{marginBottom: 20}}>Make a new password</Typography>
        }
        {!forgotPass?
            <div className="flex column">
                <PassFormField 
                    className="form-field"
                    value={form.password?.value || ""}
                    InputProps={{className: "form-input"}}
                    helperText={form.password?.message || ""}
                    inputStyle={{...VibaStyleSheet.form.input}}
                    sx={{...VibaStyleSheet.form.field, marginBottom: 0}} 
                    helperStyle={{...VibaStyleSheet.form.helperText, marginLeft: 0}}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({password: validatePassword(event.target.value)})}
                /> 
                <Typography 
                    onClick={() => setForgotPass(true)}
                    className="pointer form-helper-text" 
                    sx={{...VibaStyleSheet.form.helperText}}
                >
                    Forgot password
                </Typography>
            </div>
            : <></>
        }

        <Button 
            onClick={signin} 
            className="form-btn-outlined absolute"
            sx={{...VibaStyleSheet.form.outlinedBtn, marginTop: "25px", bottom: "20%"}} 
        >{
            !forgotPass? !resetPass? "Sign in" : "Update password" : "Send reset email"
        }</Button>
        </>
    )
}

export default SigninForm;
