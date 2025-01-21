import * as React from "react";

import { Typography } from "@mui/material";

import "../../assets/css/header.css";

import { userType } from "../../types/user";
import HeaderStyleSheet from "../../styles/header";

interface HeaderProps extends React.PropsWithChildren<any> {
    i: number
    title: string
    user: userType
    onSettings: () => void
}
function Header(props: HeaderProps) {
    const {i, title, user, ...domProps} = props;
    const {style, className, onSettings, ...rest} = domProps;

    const top = React.useRef<HTMLDivElement>(null);

    return (
        <div className="fixed header flex column align-center">
            <div className="flex align-center justify-between width-100" style={{marginTop: "20px"}} ref={top}>
                <img src={user.pfp} className="icon-header-img circle" onClick={onSettings}/>
                <Typography sx={{...HeaderStyleSheet.title}}>{title}</Typography>
                <div className="header-new-chat-btn"></div>
            </div>
        </div>
    )
}

export default Header;