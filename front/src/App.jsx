import React from "react";
import Canvas from "./Component/Canvas";
import { ToastProvider } from "./Component/Toast";

const App = () => {
  return (
    <ToastProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans antialiased text-neutral-100 select-none">
        <Canvas />
      </div>
    </ToastProvider>
  );
};

export default App;
