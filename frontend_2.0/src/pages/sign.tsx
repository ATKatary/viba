import * as React from "react";

import { Button } from "@mui/material";

import "../assets/utils.css";

import SigninForm from "../forms/signin";
import SignupForm from "../forms/signup";
import VibaStyleSheet from "../styles";

interface SignProps extends React.PropsWithChildren<any> {
}

function Sign(props: SignProps) {
    const [signup, setSignup] = React.useState<boolean>(false);

    return (
        <div className="width-100 column flex align-center justify-end" style={{height: "calc(60%)"}}>
            {/* <div className="flex align-center" style={{marginBottom: 20}} onClick={() => {}}> */}
                {/* <img src={logo} height="75px" className="margin-top-20px pointer"></img> */}
                {/* <Typography>Viba</Typography> */}
            {/* </div> */}
            {!signup? <SigninForm /> : <SignupForm />}
            <Button 
                className="form-btn-contained absolute"
                onClick={() => setSignup(!signup)} 
                sx={{...VibaStyleSheet.form.containedBtn, bottom: "calc(20% - 61px)"}}
            >
                {signup? "Sign in" : "Sign up"}
            </Button> 
        </div>
    )
}

export default Sign;
