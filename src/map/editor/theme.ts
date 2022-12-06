import { EditorView } from "codemirror";

export const theme = EditorView.baseTheme({
    "&": {
        borderRadius: "10px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
    },
})