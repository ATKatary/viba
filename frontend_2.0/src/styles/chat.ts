import { SxProps } from "@mui/material";

class ChatStyleSheet {
    public static thumbnailText: SxProps = {
        color: "var(--text-color-secondary)",
        fontSize: "var(--font-size-paragraph)"
    }

    public static thumbnailTitle: SxProps = {
        fontWeight: "bold",
        color: "var(--text-color-primary)",
        fontSize: "var(--font-size-paragraph)"
    }

    public static thumbnailTime: SxProps = {
        color: "var(--text-color-secondary)",
        fontSize: "var(--font-size-helper)"
    }

    public static backdrop: SxProps = {
        zIndex: 2,
        backdropFilter: "blur(20px)",
        color: "var(--text-color-primary)",
    }

    public static thumbnailUnread: SxProps = {
        marginTop: "10px",
        borderRadius: "50%",
        backgroundColor: "var(--blue)",
        width: "var(--font-size-helper)",
        height: "var(--font-size-helper)",
    }
}

export default ChatStyleSheet;