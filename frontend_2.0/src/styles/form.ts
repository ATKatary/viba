import { SxProps } from "@mui/material";

class FormStyleSheet {
    public input: SxProps = {
        padding: "2px 0",
        "&:before": {
            borderBottom: "1px solid var(--text-color-secondary)",
        },
        "&:after": {
            borderBottom: "1px solid var(--text-color-primary)"
        },
        fontSize: "var(--font-size-paragraph)",
        color: "var(--text-color-primary)",
    }

    public field: SxProps = {
        margin: "12px 7.5px",
    }

    public containedBtn: SxProps = {
        margin: "7.5px",
        padding: "9px 8px",
        borderRadius: "20px",
        textTransform: "none",
        color: "var(--bg-primary)",
        fontSize: "var(--font-size-paragraph)",
        backgroundColor: "var(--secondary-color)",

        "&:hover": {
            backgroundColor: "var(--secondary-color)",
        }
    }

    public outlinedBtn: SxProps = {
        margin: "7.5px",
        borderRadius: "20px",
        textTransform: "none",
        color: "var(--secondary-color)",
        fontSize: "var(--font-size-paragraph)",
        backgroundColor: "transparent",
        border: "3px solid var(--secondary-color)",

        "&:hover": {
            backgroundColor: "var(--primary-color)",
        }
    }

    public helperText: SxProps = {
        marginTop: "2px",
        marginLeft: "7.5px",
        marginBottom: "7.5px",
        fontSize: "var(--font-size-helper)",
        color: "var(--text-color-secondary)",
    }
}

export default FormStyleSheet;