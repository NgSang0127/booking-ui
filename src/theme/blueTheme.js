import { createTheme } from "@mui/material";

const blueTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0088ce",       // xanh dương — màu brand chính
            light: "#3fa9d8",
            dark: "#006ba3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#00a68c",       // xanh lá — màu brand phụ
            light: "#33bb9e",
            dark: "#007d6a",
            contrastText: "#ffffff",
        },
        error: {
            main: "#E83350",
            contrastText: "#ffffff",
        },
        background: {
            default: "#fafafa",
            paper: "#ffffff",
        },
        text: {
            primary: "#111827",
            secondary: "#6b7280",
            disabled: "#9ca3af",
        },
        divider: "rgba(0, 0, 0, 0.08)",
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" },
        h2: { fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em" },
        h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" },
        h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
        h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
        h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
        body1: { fontSize: "1rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        caption: { fontSize: "0.75rem", lineHeight: 1.5, color: "#6b7280" },
        button: { textTransform: "none", fontWeight: 500 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: "none" },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: "rgba(0,0,0,0.07)" },
            },
        },
    },
});

export default blueTheme;