import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import InjectedComponent from './InjectedComponent';

function Page() {
  const [isVisible, setIsVisible] = useState(false); // Track visibility
  const containerRef = useRef(null); // Persistent reference for container
  const rootRef = useRef(null); // Persistent reference for root

  const handleClick = () => {
    if (isVisible) {
      // Hide the component if visible
      if (rootRef.current) {
        rootRef.current.unmount(); // Unmount the component
        rootRef.current = null; // Clear the root reference
      }
      if (containerRef.current) {
        containerRef.current.remove(); // Remove the container
        containerRef.current = null; // Clear the container reference
      }
    } else {
      // Show the component if not visible
      const container = document.createElement('div');
      container.id = 'dynamic-react-root';
      document.body.appendChild(container);
      containerRef.current = container;

      const root = createRoot(container);
      rootRef.current = root;
      root.render(<InjectedComponent />);
    }

    setIsVisible(!isVisible); // Toggle visibility state
  };
  return (
    <button
    style=
    {{  backgroundColor: "#FBCFE8",
        color: "red",
        position: "fixed",
        bottom: "50px",
        right: "30px",
        fontSize: "30px"
     }}
     className="fixed "
    onClick={handleClick}
    >Page</button>
  )
}

export default Page