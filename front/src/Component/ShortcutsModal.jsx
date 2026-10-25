import React from "react";
import { FiX, FiCommand } from "react-icons/fi";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: "Tools",
      shortcuts: [
        { key: "V", label: "Select / Transform" },
        { key: "H", label: "Hand / Pan canvas" },
        { key: "P", label: "Pencil / Freehand" },
        { key: "R", label: "Rectangle" },
        { key: "C", label: "Circle / Ellipse" },
        { key: "L", label: "Line" },
        { key: "A", label: "Arrow" },
        { key: "T", label: "Text tool" },
        { key: "E", label: "Eraser" },
      ],
    },
    {
      title: "Navigation & Zoom",
      shortcuts: [
        { key: "Ctrl + Scroll", label: "Zoom in / out" },
        { key: "Space + Drag", label: "Quick pan" },
        { key: "0 / Ctrl + 0", label: "Reset zoom (100%)" },
        { key: "+ / -", label: "Zoom in / out" },
      ],
    },
    {
      title: "Actions & Edit",
      shortcuts: [
        { key: "Ctrl + Z", label: "Undo" },
        { key: "Ctrl + Y", label: "Redo (or Ctrl+Shift+Z)" },
        { key: "Del / Backspace", label: "Delete selected object" },
        { key: "?", label: "Toggle keyboard shortcuts" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-popover"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <FiCommand size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-neutral-400">Speed up your workflow with hotkeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {categories.map((cat, idx) => (
            <div
              key={cat.title}
              className={`space-y-2 ${idx === 2 ? "md:col-span-2" : ""}`}
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {cat.title}
              </h3>
              <div className="space-y-1.5">
                {cat.shortcuts.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-neutral-300 border border-white/[0.04]"
                  >
                    <span>{s.label}</span>
                    <kbd className="rounded-md border border-white/15 bg-neutral-800 px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-200 shadow-sm">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-neutral-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">?</kbd> to close</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/10 text-neutral-200 hover:bg-white/15 hover:text-white transition text-xs font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
