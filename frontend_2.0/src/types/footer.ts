import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import React from "react"

export type footerItemType = {
    title: string
    
    icon?: string
    onClick?: () => void
    style?: React.CSSProperties
}