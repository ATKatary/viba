import * as React from "react";

import { ThemeContext } from "../../../src";
import { styles } from "../../../src/styles";
import { userType } from "../../../src/types/user";

interface UserPFPProps extends React.HTMLAttributes<HTMLTextAreaElement> { 
    show: boolean 
    user: userType
    filler: boolean
}

export function UserPFP(props: UserPFPProps) {
    const {user, show, filler, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const theme = React.useContext(ThemeContext);
    return (
        show?
            <img 
                src={user.pfp}
                style={{...styles.userIcon(theme?.isDark)}} 
            /> 
            : filler? 
                <span style={{width: 30, marginLeft: 5}}></span> 
                : <></>
    )
}