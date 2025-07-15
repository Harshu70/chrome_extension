import React, { useState } from "react";

const Popup = () => {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving key:", chrome.runtime.lastError);
      } else {
        alert("API Key Saved!");
      }
    });
  };

  return (
    <>
      <div
        className="h-84 w-64 flex flex-col items-center bg-slate-500
        bg-gradient-to-r from-pink-500 to-red-600
        "
        style={{
          height:"300px"
        }}
      >
        <div className="text-4xl mt-4">Ai Helper</div>
        <div className="flex flex-col justify-around items-center text-white "
        style={{
          marginTop:"70px"
        }}>
          <h2 className="text-base">Gemini AI API Key</h2>
          <input
            type="text"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-white border-1
              border-amber-700
              rounded-md p-1 mt-1 text-black w-56"
          />
          <button
            onClick={handleSave}
            className="text-xl pr-2 pl-2 rounded-md mt-2 bg-black"
          >
            Save
          </button>
          <span className="text-center text-sm">
            your key is secured and saved in your localStorage
          </span>
        </div>
        <a href="https://makersuite.google.com/app/apikey" 
        target="_blank"
        className="text-blue-700 underline mt-1 text-sm"
        style={{
          marginLeft:"90px"
        }}>
          how to get Api Key?
        </a>
      </div>
    </>
  );
};
//jb save krega to page change hogs aur ek option aayega phir se api key dalne ka to phir se ye page khulega

export default Popup;
