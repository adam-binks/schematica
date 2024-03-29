import { autocompletion } from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { Extension } from "@codemirror/state";
import { keymap, placeholder } from "@codemirror/view";
import { EditorView } from "codemirror";
import { domEventHandlers } from "../../editor/domEventHandlers";
import { recipelang } from "./recipeLanguage";
import { recipeTheme } from "./recipeTheme";
import { ExecuteCommandFunc, runCommandPlugin } from "./runCommandPlugin";
import { addCheckboxOnNewline, stepCheckboxPlugin } from "./stepCheckbox";
import { highlighting } from "./syntaxHighlighting";

const staticRecipeExtensions: Extension[] = [
    recipeTheme,
    recipelang(),
    EditorView.lineWrapping,
    placeholder("Plan out what you'll do"),
    domEventHandlers,
    autocompletion({
        closeOnBlur: false,
    }),
    highlighting,
    stepCheckboxPlugin,
    addCheckboxOnNewline,
    keymap.of([indentWithTab]),
]

export function recipeExtensions({ execute }: { execute: (execute: ExecuteCommandFunc) => void }): Extension[] {
    return [
        ...staticRecipeExtensions,
        // runCommandPlugin(execute), // TODO re-enable once this is ready
    ]
}
