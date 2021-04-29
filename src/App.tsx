import React from "react";
import Editor from "@monaco-editor/react";
import "./App.css";

function App() {
  const options = {
    autoClosingBrackets: "always",
    autoClosingPairs: "open",
    // matchBrackets: "always",
    // autoClosingQuotes: "always",
    // autoClosingPairs: [
    //   { open: "<", close: ">" },
    //   { open: "$(", close: ")" },
    //   { open: '"', close: '"', notIn: ["string"] },
    //   { open: "'", close: "'", notIn: ["string", "comment"] },
    //   { open: "/**", close: " */", notIn: ["string"] },
    //   { open: "OP_IF", close: " OP_ENDIF", notIn: ["string", "comment"] },
    //   { open: "OP_NOTIF", close: " OP_ENDIF", notIn: ["string", "comment"] },
    // ],
    brackets: [
      ["<", ">"],
      ["$(", ")"],
    ],
  };
  return <Editor height="100vh" width="50vw" options={options} language="json" theme="vs-dark" defaultValue="// some comment" />;
}

export default App;
