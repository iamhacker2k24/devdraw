import React from "react";
import {
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiGrid,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { BsGrid3X3Gap, BsSquare } from "react-icons/bs";

const ZoomControls = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitCenter,
  gridMode,
  setGridMode,
  bgColor,
  setBgColor,
}) => {
  const percentage = Math.round(scale * 100);

  const toggleGrid = () => {
    if (gridMode === "dots") setGridMode("grid");
    else if (gridMode === "grid") setGridMode("none");
    else setGridMode("dots");
  };

  const isDark = bgColor !== "#f8fafc" && bgColor !== "#ffffff";

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 pointer-events-auto">
      {/* Zoom Pill */}
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-neutral-900/85 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5 text-xs">
        <button
          onClick={onZoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition active:scale-95"
          title="Zoom out (-)"
        >
          <FiZoomOut size={14} />
        </button>

        <button
          onClick={onResetZoom}
          className="px-2 py-1 rounded-lg font-mono text-xs font-medium text-neutral-200 hover:bg-white/10 hover:text-white transition"
          title="Reset zoom to 100% (Press 0)"
        >
          {percentage}%
        </button>

        <button
          onClick={onZoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition active:scale-95"
          title="Zoom in (+)"
        >
          <FiZoomIn size={14} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-0.5" />

        <button
          onClick={onFitCenter}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition active:scale-95"
          title="Center canvas view"
        >
          <FiMaximize2 size={13} />
        </button>
      </div>

      {/* Grid Mode & Canvas Theme Pill */}
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-neutral-900/85 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5 text-xs">
        {/* Toggle Grid */}
        <button
          onClick={toggleGrid}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
            gridMode !== "none"
              ? "bg-blue-600/30 text-blue-400 border border-blue-500/30"
              : "text-neutral-400 hover:bg-white/10 hover:text-white"
          }`}
          title={`Grid style: ${gridMode.toUpperCase()} (Click to toggle)`}
        >
          {gridMode === "dots" && <BsGrid3X3Gap size={14} />}
          {gridMode === "grid" && <FiGrid size={14} />}
          {gridMode === "none" && <BsSquare size={12} className="opacity-60" />}
        </button>

        {/* Quick Dark/Light Canvas Toggle */}
        <button
          onClick={() => {
            if (isDark) {
              setBgColor("#f8fafc");
            } else {
              setBgColor("#121214");
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition"
          title={isDark ? "Switch to Light Canvas" : "Switch to Dark Canvas"}
        >
          {isDark ? <FiSun size={14} className="text-amber-400" /> : <FiMoon size={14} className="text-blue-400" />}
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;
