import * as React from "react";

import { IconButton } from "@mui/material";

import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

import { styles } from "../../src/styles";
import { THEME } from "../../src/constants";
import { ImageFormField } from "../../src/forms/fields";
import { uploadPFP } from "../../src/api/viba";
import { userType } from "../../src/types/user";
import { ThemeContext } from "../../src";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    user?: userType
}

function Sidebar(props: SidebarProps) {
    const {user, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    const theme = React.useContext(ThemeContext);

    return ( 
        <div 
            className={`height-100 flex column align-center justify-between ${className}`} 
            style={{
                backgroundColor: THEME.BACKGROUND_ACCENT_2(theme?.isDark),
                ...style,
            }}
        >
            <div className="flex column align-center" style={{marginTop: 50}}>
                <IconButton>
                    <ChatBubbleRoundedIcon style={{width: 25, height: 25, color: THEME.DOMINANT(theme?.isDark)}}/>
                </IconButton>
                <IconButton style={{marginTop: 10}}>
                    <PaymentsRoundedIcon style={{width: 25, height: 25, color: THEME.DOMINANT(theme?.isDark)}}/>
                </IconButton>
            </div>
            <div className="flex column align-center" style={{marginBottom: 20}}>
                <ImageFormField 
                    src={user?.pfp}
                    style={{...styles.userIcon(theme?.isDark, 30)}}
                    onUpload={async (file) => await uploadPFP(user?.id, file)} 
                />
            </div>
        </div>
    )
}

export default Sidebar;