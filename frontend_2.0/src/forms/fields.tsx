import * as React from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, SxProps, TextField, TextFieldProps } from '@mui/material';

type PassFieldProps = FormFieldProps & {
    adornmentColor?: string
} 
export function PassFormField(props: PassFieldProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const {InputProps, adornmentColor, ...domProps} = props;

    return (
        <FormField
            placeholder="Password"
            type={showPassword? "text" : "password"}

            {...domProps}
            InputProps={{
                endAdornment: 
                    <InputAdornment position="start">
                        <IconButton
                            aria-label="toggle password visibility"
                            style={{color: "var(--text-color-primary)"}}
                            onClick={() => {setShowPassword(!showPassword)}}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>,
                ...InputProps
            }}
        />
    )
}

type FormFieldProps = TextFieldProps & {
    inputStyle?: SxProps
    labelStyle?: SxProps
    helperStyle?: SxProps
    setHelperText?: (helperText: string) => void
} 
export function FormField(props: FormFieldProps) {
    const {setHelperText, helperStyle, inputStyle, labelStyle, ...domProps} = props;
    const {sx, helperText, InputProps, InputLabelProps, type, variant, ...other} = domProps;
    
    let focused = false;
    let color: "primary" | "success" | "warning" | "info" = "info";

    if (props.focused) focused = true;
    else if (helperText === "good") {
        focused = true;
        color = "success"; 
        if (setHelperText) setHelperText(""); 
    } else if (helperText !== "" && helperText) {
        color = "warning"; 
        focused = true;
    } else focused = false;

    return (
        <TextField 
            {...other}
            sx={{ ...sx}} 
            focused={focused}
            helperText={helperText}
            color={color || "primary"}
            InputProps={{
                sx: {
                    padding: 0,
                    borderRadius: 0,
                    ...inputStyle,
                },
                ...InputProps
            }}
            FormHelperTextProps={{
                sx: {...helperStyle}
            }}
            onTouchEnd={other.onTouchEnd}
            InputLabelProps={{
                sx: {...labelStyle},
                ...InputLabelProps
            }}
            type = {type || "text"}
            variant={variant || "standard"} 
            inputRef={(input) => other.focused? input && input.focus() : undefined}
        >
        </TextField>
    )
}

interface ImageFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    onUpload: (file: File) => any
}
export function ImageFormField(props: ImageFormFieldProps) {
    const {src, onUpload, ...domProps} = props; 
    const {style, className, ...rest} = domProps;

    const imgRef = React.useRef<HTMLImageElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div>
            <img ref={imgRef} onClick={() => inputRef.current?.click()} style={{...style}} src={src}/>
            <input 
                ref={inputRef}
                type='file' 
                style={{display: "none"}}
                onChange={async (event) => {
                    const files = event.target.files
                    const reader = new FileReader()

                    reader.addEventListener("load", () => {
                        if (imgRef.current) imgRef.current.src = reader.result as string;
                    }, false);
                    
                    if (files) {
                        reader.readAsDataURL(files[0]);
                        await onUpload(files[0]);
                    }

                    event.target.value = ""
                }}
            />
        </div>
    )
}