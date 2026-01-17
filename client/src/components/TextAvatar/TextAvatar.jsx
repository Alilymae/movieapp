import { Avatar } from "@mui/material";

// TEXT AVATAR
const TextAvatar = ({ text = "?" }) => {
    const stringToColor = (str) => {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    };

    const firstLetter = text?.trim()?.[0]?.toUpperCase() || "?";

    return (
        <Avatar
            sx={{
                bgcolor: stringToColor(text),
                width: 40,
                height: 40,
                fontWeight: 700
            }}
        >
            {firstLetter}
        </Avatar>
    );
};

export default TextAvatar;
