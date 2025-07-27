import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import InjectedComponent from "./InjectedComponent";

function Page() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const rootRef = useRef(null);

  const handleClick = () => {
    if (isVisible) {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    } else {
      const container = document.createElement("div");
      container.id = "dynamic-react-root";
      document.body.appendChild(container);
      containerRef.current = container;

      const root = createRoot(container);
      rootRef.current = root;
      root.render(<InjectedComponent />);
    }

    setIsVisible(!isVisible);
  };
  return (
    <>
      {/* <button
        style={{
          backgroundColor: "#FBCFE8",
          color: "red",
          position: "fixed",
          bottom: "50px",
          right: "30px",
          fontSize: "30px",
        }}
        className="fixed "
        onClick={handleClick}
      >
        Page
      </button> */}
      <button
      style={{
          // backgroundColor: "#FBCFE8",
          // color: "red",
          position: "fixed",
          bottom: "50px",
          right: "30px",
          fontSize: "30px",
          height:"55px",
          width:"45px"
        }}
      onClick={handleClick}>
        <img
        src="https://res.cloudinary.com/dzoozzolx/image/upload/v1752932390/final_ynhe9y.png" alt="icon" />
      </button>
    </>
  );
}

export default Page;
