import React, { useState, useRef, useEffect } from "react";

function InjectedComponent() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const getApiKey = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get("openai_api_key", (result) => {
        resolve(result.openai_api_key);
      });
    });
  };

  // const api = import.meta.env.VITE_API;

  const toggleChatbox = () => setIsChatOpen((prev) => !prev);

  useEffect(() => {
    chrome.storage.local.get("chatHistory", (result) => {
      if (result.chatHistory) {
        setMessages(JSON.parse(result.chatHistory));
      }
    });
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    chrome.storage.local.set({ chatHistory: JSON.stringify(messages) });
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponse = await getAnswerFromAi(trimmed);
      const segments = splitMessageIntoSegments(botResponse);

      for (let segment of segments) {
        await typeOutMessage(segment);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const typeOutMessage = async (segment) => {
    let text = "";
    for (let char of segment.text) {
      text += char;
      await new Promise((res) => setTimeout(res, 5)); // Typing speed
    }
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text, isCode: segment.isCode },
    ]);
  };

  const getAnswerFromAi = async (msg) => {
    const apiKey = await getApiKey();
    if(!apiKey) console.log("api nahi");
    
    const updatedMessages = [...messages, { sender: "user", text: msg }];

    const formatted = [
      {
        role: "user",
        parts: [{ text: "Answer briefly and to the point." }],
      },
      ...updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: formatted,
        }),
      }
    );

    const result = await res.json();
    return (
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "please enter your Api key first."
    );
  };

  const splitMessageIntoSegments = (text) => {
    const segments = [];
    const parts = text.split(/```([\s\S]*?)```/g);

    for (let i = 0; i < parts.length; i++) {
      const isCode = i % 2 === 1;
      if (parts[i].trim()) {
        segments.push({ text: parts[i], isCode });
      }
    }
    return segments;
  };

  return (
    <>
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "4vh",
            right: "1vw",
            width: "35vw",
            height: "90%",
            background: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontSize: "1rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              color: "#ffffff",
              padding: "0rem 1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(to right, #dc2626, #F12773 )",
            }}
          >
            <p
              style={{ fontSize: "1rem", fontWeight: "bold", padding: ".8rem" }}
            >
              Admin Bot
            </p>
            <div>
              <button
                onClick={async () => {
                  const clearedMessages = [];

                  setMessages(clearedMessages);
                  chrome.storage.local.set(
                    "chatHistory",
                    JSON.stringify(clearedMessages)
                  );

                  // Optional: ensure brief-mode prompt is still saved in hiddenPrompt
                  chrome.storage.local.set({
                    hiddenPrompt: [
                      {
                        role: "user",
                        parts: [{ text: "Answer briefly and to the point." }],
                      },
                    ],
                  });
                }}
                style={{
                  background: "#27200df2",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                New Chat
              </button>
              <button
                onClick={toggleChatbox}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: ".7rem",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(to right,#EE1D5C, #dc2626 )"
                        : msg.isCode
                        ? "#1e1e1e"
                        : "#303030",
                    color:
                      msg.sender === "user"
                        ? "#ffffff"
                        : msg.isCode
                        ? "#d4d4d4"
                        : "#ffffff",
                    padding: msg.isCode ? "12px" : "5px 12px",
                    borderRadius: "12px",
                    fontSize:".9rem",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    whiteSpace: msg.isCode ? "pre-wrap" : "normal",
                    fontFamily: msg.isCode ? "monospace" : "inherit",
                    overflowX: msg.isCode ? "auto" : "unset",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  marginLeft: "8px",
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                Typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
              padding: "8px",
              background: "linear-gradient(to right,#dc2626, #F12773 )",
            }}
          >
            <textarea
              type="text"
              placeholder="Type a message"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px 0 0 6px",
                outline: "none",
                color: "white",
                background: "#303030",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                resize: "none",
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#E62E43",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "0 6px 6px 0",
                cursor: "pointer",
                fontSize: "14px",
              }}
              disabled={!inputValue.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InjectedComponent;
