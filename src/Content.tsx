import { createRoot } from "react-dom/client";
import React from "react";
import Page from "./Page";
console.log("challlaa ya nhi");
const root = document.createElement("div");
root.id = "__leetcode_ai_whisper_container";
document.body.append(root);

createRoot(root).render(<Page />);
