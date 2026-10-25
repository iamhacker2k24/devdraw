import React, { useState, useRef, useEffect } from "react";
import {
  CiText,
  CiEraser,
  CiLock,
  CiUnlock,
} from "react-icons/ci";
import { HiOutlineCursorArrowRays } from "react-icons/hi2";
import { FaRegCircle, FaRegHandPaper } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import {
  MdOutlinePhoto,
  MdOutlineWaterDrop,
  MdCheckBoxOutlineBlank,
  MdUndo,
  MdRedo,
} from "react-icons/md";
import { IoArrowForwardOutline, IoChevronForward } from "react-icons/io5";
import { TbStrokeStraight } from "react-icons/tb";

const Header = ({
  sentValu,
  onUndo,
  onRedo,
  activeTool,
  setActiveTool,
  strokeColor,
  setStrokeColor,
  canvasBgColor,
  setCanvasBgColor,
}) => {
  const [lock, setLock] = useState(false);
  const [selectedTool, setSelectedTool] = useState(activeTool || "pencil");
  const [fillColor, setFillColor] = useState(strokeColor || "#38de00");
  const [backgroundColor, setBackgroundColor] = useState(canvasBgColor || "#121214");
  const [file, setFile] = useState(null);
  const [opacity, setOpacity] = useState(100);
  const [stockWidth, setStockWidth] = useState(4);

  // Active flyout: "view" | "shapes" | "draw" | "colors" | null
  const [openPanel, setOpenPanel] = useState(null);
  const [colorPickerActive, setColorPickerActive] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState("stroke"); // "stroke" | "canvas"

  const photoref = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (activeTool && activeTool !== selectedTool) {
      setSelectedTool(activeTool);
    }
  }, [activeTool]);

  useEffect(() => {
    if (canvasBgColor && canvasBgColor !== backgroundColor) {
      setBackgroundColor(canvasBgColor);
    }
  }, [canvasBgColor]);

  useEffect(() => {
    sentValu({
      selectedTool,
      fillColor,
      backgroundColor,
      file,
      opacity,
      stockWidth,
    });
    if (setActiveTool) setActiveTool(selectedTool);
    if (setStrokeColor) setStrokeColor(fillColor);
    if (setCanvasBgColor) setCanvasBgColor(backgroundColor);
  }, [selectedTool, fillColor, backgroundColor, file, opacity, stockWidth]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerActive) return;
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPickerActive]);

  const presetStrokeColors = [
    "#ffffff", "#f87171", "#fb923c", "#facc15",
    "#4ade80", "#2dd4bf", "#38bdf8", "#818cf8",
    "#c084fc", "#f472b6", "#9ca3af", "#18181b",
  ];

  const presetBgColors = [
    "#121214", "#0a0d14", "#000000", "#18181b",
    "#1e293b", "#0f172a", "#f8fafc", "#ffffff",
  ];

  const strokeWidthPresets = [2, 4, 8, 14];

  const groups = {
    view: {
      id: "view",
      options: [
        { id: "cursor", icon: <HiOutlineCursorArrowRays size={18} />, label: "Select (V)" },
        { id: "hand", icon: <FaRegHandPaper size={16} />, label: "Hand Pan (H)" },
      ],
    },
    shapes: {
      id: "shapes",
      options: [
        { id: "rectangle", icon: <MdCheckBoxOutlineBlank size={18} />, label: "Rectangle (R)" },
        { id: "circle", icon: <FaRegCircle size={17} />, label: "Circle (C)" },
        { id: "line", icon: <TbStrokeStraight size={18} />, label: "Line (L)" },
        { id: "arrow", icon: <IoArrowForwardOutline size={18} />, label: "Arrow (A)" },
      ],
    },
    draw: {
      id: "draw",
      options: [
        { id: "pencil", icon: <FaPencil size={16} />, label: "Pencil (P)" },
        { id: "text", icon: <CiText size={20} />, label: "Text (T)" },
      ],
    },
  };

  const togglePanel = (id) => setOpenPanel((prev) => (prev === id ? null : id));

  const selectFromGroup = (toolId) => {
    setSelectedTool(toolId);
    setOpenPanel(null);
  };

  const groupMainIcon = (group) => {
    const active = group.options.find((o) => o.id === selectedTool);
    return active ? active.icon : group.options[0].icon;
  };

  const isGroupActive = (group) => group.options.some((o) => o.id === selectedTool);

  const buttonBaseClass = (active) => `
    relative
    group
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-xl
    transition-all
    duration-200
    ease-out
    active:scale-95
    ${
      active
        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 font-semibold"
        : "text-neutral-400 hover:bg-white/10 hover:text-white"
    }
  `;

  return (
    <>
      <input
        ref={photoref}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      <div ref={wrapperRef} className="fixed left-4 top-1/2 z-40 -translate-y-1/2">
        <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl ring-1 ring-white/5">
          {/* Lock Canvas toggle */}
          <button
            onClick={() => setLock(!lock)}
            className={buttonBaseClass(lock)}
            title={lock ? "Unlock canvas interaction" : "Lock canvas view"}
          >
            {lock ? <CiLock size={19} className="text-amber-400" /> : <CiUnlock size={19} />}
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          {/* View Group: Select / Hand */}
          <div className="relative">
            <button
              onClick={() => togglePanel("view")}
              className={buttonBaseClass(isGroupActive(groups.view) || openPanel === "view")}
              title="Select (V) / Hand Pan (H)"
            >
              {groupMainIcon(groups.view)}
              <IoChevronForward
                size={8}
                className="absolute bottom-1 right-1 text-neutral-400 group-hover:text-white transition"
              />
            </button>

            {/* View flyout */}
            {openPanel === "view" && (
              <div className="absolute left-12 top-0 flex gap-1 rounded-2xl border border-white/10 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-slide-right z-50">
                {groups.view.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectFromGroup(opt.id)}
                    title={opt.label}
                    className={buttonBaseClass(selectedTool === opt.id)}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Draw Group: Pencil / Text */}
          <div className="relative">
            <button
              onClick={() => togglePanel("draw")}
              className={buttonBaseClass(isGroupActive(groups.draw) || openPanel === "draw")}
              title="Pencil (P) / Text (T)"
            >
              {groupMainIcon(groups.draw)}
              <IoChevronForward
                size={8}
                className="absolute bottom-1 right-1 text-neutral-400 group-hover:text-white transition"
              />
            </button>

            {/* Draw flyout */}
            {openPanel === "draw" && (
              <div className="absolute left-12 top-0 flex gap-1 rounded-2xl border border-white/10 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-slide-right z-50">
                {groups.draw.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectFromGroup(opt.id)}
                    title={opt.label}
                    className={buttonBaseClass(selectedTool === opt.id)}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shapes Group: Rectangle / Circle / Line / Arrow */}
          <div className="relative">
            <button
              onClick={() => togglePanel("shapes")}
              className={buttonBaseClass(isGroupActive(groups.shapes) || openPanel === "shapes")}
              title="Shapes: Rectangle (R), Circle (C), Line (L), Arrow (A)"
            >
              {groupMainIcon(groups.shapes)}
              <IoChevronForward
                size={8}
                className="absolute bottom-1 right-1 text-neutral-400 group-hover:text-white transition"
              />
            </button>

            {/* Shapes flyout */}
            {openPanel === "shapes" && (
              <div className="absolute left-12 top-0 flex gap-1 rounded-2xl border border-white/10 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-slide-right z-50">
                {groups.shapes.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectFromGroup(opt.id)}
                    title={opt.label}
                    className={buttonBaseClass(selectedTool === opt.id)}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Eraser */}
          <button
            onClick={() => setSelectedTool("eraser")}
            className={buttonBaseClass(selectedTool === "eraser")}
            title="Eraser (E)"
          >
            <CiEraser size={20} />
          </button>

          {/* Insert Image */}
          <button
            onClick={() => {
              setSelectedTool("image");
              if (photoref.current) photoref.current.click();
            }}
            className={buttonBaseClass(selectedTool === "image")}
            title="Insert Image"
          >
            <MdOutlinePhoto size={19} />
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          {/* Color & Style Inspector Button */}
          <div className="relative">
            <button
              onClick={() => togglePanel("colors")}
              className={`relative group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                openPanel === "colors" ? "ring-2 ring-blue-500 shadow-lg" : "hover:scale-105"
              }`}
              title="Style Inspector (Colors, Stroke, Opacity)"
            >
              <div
                className="h-7 w-7 rounded-lg border border-white/30 shadow-inner flex items-center justify-center"
                style={{ backgroundColor: fillColor }}
              >
                <MdOutlineWaterDrop
                  size={15}
                  className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                />
              </div>
              <IoChevronForward
                size={8}
                className="absolute bottom-1 right-1 text-white drop-shadow"
              />
            </button>

            {/* Redesigned Style Inspector Popover */}
            {openPanel === "colors" && (
              <div className="absolute bottom-0 left-12 w-64 rounded-2xl border border-white/10 bg-neutral-900/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl ring-1 ring-white/10 animate-slide-right z-50 text-xs">
                {/* Header with tabs */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                  <span className="font-semibold text-white">Style & Properties</span>
                  <div className="flex rounded-lg bg-neutral-800 p-0.5">
                    <button
                      onClick={() => setActiveColorTab("stroke")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition ${
                        activeColorTab === "stroke"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Stroke
                    </button>
                    <button
                      onClick={() => setActiveColorTab("canvas")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition ${
                        activeColorTab === "canvas"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Canvas
                    </button>
                  </div>
                </div>

                {/* Stroke Color Tab */}
                {activeColorTab === "stroke" && (
                  <div className="space-y-3">
                    {/* Custom Stroke Color Picker Input */}
                    <label className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-neutral-800/80 px-2.5 py-1.5 transition hover:border-blue-500/50">
                      <span
                        className="h-6 w-6 shrink-0 rounded-lg border border-white/20 shadow-sm"
                        style={{ backgroundColor: fillColor }}
                      />
                      <span className="font-mono text-xs uppercase text-neutral-200">
                        {fillColor}
                      </span>
                      <span className="ml-auto rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400">
                        Custom
                      </span>
                      <input
                        type="color"
                        value={fillColor}
                        onChange={(e) => setFillColor(e.target.value)}
                        onFocus={() => setColorPickerActive(true)}
                        onBlur={() => setColorPickerActive(false)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {presetStrokeColors.map((c) => (
                        <button
                          key={`stroke-${c}`}
                          onClick={() => setFillColor(c)}
                          title={c}
                          className={`h-6 w-6 rounded-lg border transition-transform hover:scale-110 flex items-center justify-center ${
                            fillColor.toLowerCase() === c.toLowerCase()
                              ? "border-blue-400 ring-2 ring-blue-500/50 scale-105"
                              : "border-white/10"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Stroke Width Selector */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span>Stroke Width</span>
                        <span className="font-mono text-neutral-200">{stockWidth}px</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {strokeWidthPresets.map((w) => (
                          <button
                            key={w}
                            onClick={() => setStockWidth(w)}
                            className={`flex flex-col items-center justify-center py-1.5 rounded-lg border transition ${
                              stockWidth === w
                                ? "border-blue-500 bg-blue-500/10 text-white"
                                : "border-white/10 bg-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                          >
                            <span
                              className="w-5 rounded-full bg-current mb-1"
                              style={{ height: `${Math.min(w, 8)}px` }}
                            />
                            <span className="text-[10px] font-mono">{w}px</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity Slider */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span>Opacity</span>
                        <span className="font-mono text-neutral-200">{opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-800 accent-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Canvas Background Tab */}
                {activeColorTab === "canvas" && (
                  <div className="space-y-3">
                    <label className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-neutral-800/80 px-2.5 py-1.5 transition hover:border-blue-500/50">
                      <span
                        className="h-6 w-6 shrink-0 rounded-lg border border-white/20 shadow-sm"
                        style={{ backgroundColor: backgroundColor }}
                      />
                      <span className="font-mono text-xs uppercase text-neutral-200">
                        {backgroundColor}
                      </span>
                      <span className="ml-auto rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400">
                        Custom
                      </span>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        onFocus={() => setColorPickerActive(true)}
                        onBlur={() => setColorPickerActive(false)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      {presetBgColors.map((c) => (
                        <button
                          key={`bg-${c}`}
                          onClick={() => setBackgroundColor(c)}
                          title={c}
                          className={`h-8 rounded-lg border transition-transform hover:scale-105 flex items-center justify-center ${
                            backgroundColor.toLowerCase() === c.toLowerCase()
                              ? "border-blue-400 ring-2 ring-blue-500/50 scale-105"
                              : "border-white/10"
                          }`}
                          style={{ backgroundColor: c }}
                        >
                          {c === "#ffffff" || c === "#f8fafc" ? (
                            <span className="text-[10px] text-neutral-800 font-bold">Light</span>
                          ) : c === "#121214" ? (
                            <span className="text-[10px] text-neutral-300">Slate</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;