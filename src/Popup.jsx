import React, { useState, useEffect } from "react";

const Popup = () => {
  const [apiKey, setApiKey] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("openai_api_key", (data) => {
      if (data.openai_api_key) {
        setShowSuccess(true);
      }
    });
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return alert("Please enter a valid API Key");
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving key:", chrome.runtime.lastError);
      } else {
        setShowSuccess(true);
      }
    });
  };

  const handleChangeKey = () => {
    setApiKey("");
    setShowSuccess(false);
  };

  const handleDeleteKey = () => {
    chrome.storage.local.remove("openai_api_key", () => {
      if (chrome.runtime.lastError) {
        console.error("Error deleting key:", chrome.runtime.lastError);
      } else {
        alert("API Key Deleted!");
        handleChangeKey();
      }
    });
  };

  return (
    <div
      className="h-84 w-72 flex flex-col items-center bg-gradient-to-r from-pink-500 to-red-600"
      style={{ height: "300px" }}
    >
      {showSuccess ? (
        <>
          <div className="text-3xl mt-16 text-white font-bold">Success!</div>
          <p className="text-sm mt-2 text-white px-4 text-center">
            Your Gemini API Key has been saved securely.
          </p>
          <button
            onClick={handleChangeKey}
            className="mt-4 bg-black text-white px-4 py-2 rounded-md"
          >
            Change API Key
          </button>
          <button
            onClick={handleDeleteKey}
            className="mt-2 bg-white text-black px-4 py-2 rounded-md"
          >
            Delete API Key
          </button>
        </>
      ) : (
        <>
          <div className="text-4xl mt-4 text-white font-bold">Ai Helper</div>
          <div
            className="flex flex-col justify-around items-center text-white"
            style={{ marginTop: "50px" }}
          >
            <h2 className="text-base">Gemini AI API Key</h2>
            <input
              type="text"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white border-1 border-amber-700 rounded-md p-2 mt-1 text-black w-56"
            />
            <button
              onClick={handleSave}
              className="text-xl pr-2 pl-2 rounded-md mt-2 bg-black text-white"
            >
              Save
            </button>
            <span className="text-center text-sm mt-1 mx-4">
              Your key is secured and saved in Chrome local storage.
            </span>
          </div>
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 underline mt-2 text-sm mb-4"
            style={{ marginLeft: "90px" }}
          >
            How to get API Key?
          </a>
        </>
      )}
    </div>
  );
};

export default Popup;
