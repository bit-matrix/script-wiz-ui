/* eslint-disable no-template-curly-in-string */
import React from "react";
import "./App.scss";
import ScriptNavbar from "./components/ScriptNavbar/ScriptNavbar";
import ScriptEditor from "./components/ScriptEditor/ScriptEditor";

const App = () => {
    return (
        <div style={{ height: "100%" }}>
            <ScriptNavbar />
            <ScriptEditor />
        </div>
    );
};

export default App;
