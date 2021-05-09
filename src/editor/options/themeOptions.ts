import { blue, darkOlive, fuchsia, lightBlue, lightOlive, mistBlue, oak, red, salmon, subtleGray, vibrantYellow } from "../utils/colors";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const themeOptions: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: false,
  rules: [
    { token: "delimiter.evaluation", foreground: vibrantYellow },
    { token: "delimiter.push", foreground: subtleGray },
    { token: "opcode.push", foreground: subtleGray },
    { token: "opcode.push-number", foreground: lightOlive },
    { token: "opcode.disabled", foreground: red },
    { token: "opcode.signature", foreground: fuchsia },
    { token: "opcode.flow-control", foreground: salmon },
    { token: "opcode.blocking", foreground: oak },
    { token: "opcode.other", foreground: blue },
    { token: "identifier", foreground: lightBlue },
    { token: "literal.bigint", foreground: lightOlive },
    { token: "literal.hex", foreground: darkOlive },
    { token: "literal.binary", foreground: mistBlue },
    { token: "invalid", foreground: red },
    { token: "", background: "1E1E1E" },
    { token: "", foreground: "ce9178" },
  ],
  colors: {
    "editor.foreground": "#FFFFFF",
    "editor.background": "#1E1E1E",
  },
};

export default themeOptions;
