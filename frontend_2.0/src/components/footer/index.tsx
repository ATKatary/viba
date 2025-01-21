import * as React from "react";
import { IconButton, Typography } from "@mui/material";

import "../../assets/css/footer.css";
import { footerItemType } from "../../types/footer";

interface FooterProps extends React.PropsWithChildren<any> {
    i: number
    setI: (i: number) => void
    items: footerItemType[]
}

function Footer(props: FooterProps) {
    const {i, setI, items} = props;

    return (
        <div className="fixed footer width-100 flex align-start justify-around">
            {items.map((item, j) => {
                const active = i === j;

                return (
                    <div 
                        onClick={() => {setI(j); item?.onClick?.();}}
                        className="pointer flex column align-center footer-icon-container"
                    >
                        <div 
                            className="footer-icon" 
                            style={{
                                ...item.style,
                                backgroundImage: `var(--${item.icon}${active? "-active" : ""})`,
                            }}
                        />
                        <Typography sx={{fontSize: "var(--font-size-helper)", color: active? "var(--text-color-primary)" : "var(--text-color-secondary)"}}>{item.title}</Typography>
                    </div>
                )
            })}
        </div>
    )
}

export default Footer;