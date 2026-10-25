import React, { useState, useRef, useEffect } from "react";
import {
  FiWifi,
  FiWifiOff,
  FiUsers,
  FiCopy,
  FiCheck,
  FiPlus,
  FiZap,
  FiDownload,
  FiTrash2,
  FiHelpCircle,
  FiChevronDown,
  FiShare2,
  FiEdit2,
  FiCheckCircle,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";
import { MdUndo, MdRedo } from "react-icons/md";
import { useToast } from "./Toast";

const TopBar = ({
  roomId,
  setRoomId,
  onJoinRoom,
  isConnected,
  userCount,
  onGenerateRoom,
  onUndo,
  onRedo,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onImportJSON,
  onClearCanvas,
  onOpenShortcuts,
  boardTitle,
  setBoardTitle,
}) => {
  const { showToast } = useToast();
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputRoom, setInputRoom] = useState(roomId || "");
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const menuRef = useRef(null);
  const roomModalRef = useRef(null);
  const jsonInputRef = useRef(null);

  useEffect(() => {
    setInputRoom(roomId || "");
  }, [roomId]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (roomModalRef.current && !roomModalRef.current.contains(e.target)) {
        setIsRoomModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleCopyRoom = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      showToast("Room ID copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (roomId) {
      const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}`;
      navigator.clipboard.writeText(url);
      showToast("Collaboration link copied to clipboard!", "success");
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onJoinRoom(inputRoom.trim());
      setIsRoomModalOpen(false);
      showToast(`Switched to room ${inputRoom.trim()}`, "info");
    }
  };

  const handleCreateNew = () => {
    const newRoom = onGenerateRoom();
    setInputRoom(newRoom);
    onJoinRoom(newRoom);
    setIsRoomModalOpen(false);
    showToast(`Created new room: ${newRoom}`, "success");
  };

  return (
    <>
      <header className="fixed top-3 left-4 right-4 z-40 flex items-center justify-between pointer-events-none gap-2">
        {/* Left Island: Brand + Board Name + Menu */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-neutral-900/85 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5">
            {/* Logo */}
            <div className="flex items-center gap-2 pr-1.5 border-r border-white/10">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/25">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent hidden sm:inline-block">
                DevDraw
              </span>
            </div>

            {/* Document Title */}
            <div className="flex items-center gap-1.5 px-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  autoFocus
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-28 sm:w-36 rounded-lg bg-neutral-800 px-2 py-0.5 text-xs text-white outline-none border border-blue-500/50"
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="group flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-white transition"
                  title="Rename board"
                >
                  <span className="max-w-[120px] truncate">{boardTitle || "Untitled Board"}</span>
                  <FiEdit2 size={11} className="text-neutral-500 group-hover:text-neutral-300 transition" />
                </button>
              )}
            </div>

            {/* Actions Menu Dropdown Toggle */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-xl p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
                title="Board menu"
              >
                <FiChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-52 rounded-2xl border border-white/10 bg-neutral-900/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl ring-1 ring-white/10 animate-popover z-50">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    File & Export
                  </div>
                  <button
                    onClick={() => {
                      onExportPNG();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition text-left"
                  >
                    <FiDownload size={14} className="text-blue-400" />
                    <span>Export as PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportSVG();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition text-left"
                  >
                    <FiFileText size={14} className="text-emerald-400" />
                    <span>Export as SVG</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportJSON();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition text-left"
                  >
                    <FiShare2 size={14} className="text-purple-400" />
                    <span>Save Board (.json)</span>
                  </button>
                  <button
                    onClick={() => {
                      jsonInputRef.current.click();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition text-left"
                  >
                    <FiUploadCloud size={14} className="text-amber-400" />
                    <span>Load Board (.json)</span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      onClearCanvas();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <FiTrash2 size={14} />
                    <span>Clear Canvas</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden File Input for Importing JSON */}
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          onChange={onImportJSON}
          className="hidden"
        />

        {/* Center Island: Collaborative Room Pill */}
        <div className="pointer-events-auto relative" ref={roomModalRef}>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/85 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5 text-xs whitespace-nowrap">
            {/* Status light */}
            <span
              className={`flex h-2 w-2 shrink-0 rounded-full ${
                isConnected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
              }`}
            />

            {/* Room ID */}
            <button
              onClick={() => setIsRoomModalOpen((prev) => !prev)}
              className="flex items-center gap-1.5 font-mono text-neutral-200 hover:text-white transition px-1 whitespace-nowrap"
              title="Room settings"
            >
              <span className="whitespace-nowrap">{roomId || "Solo"}</span>
              <FiChevronDown size={13} className={`text-neutral-400 transition-transform ${isRoomModalOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Users count */}
            <div
              className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300 border border-white/5"
              title={`${userCount} active participant(s)`}
            >
              <FiUsers size={11} className="text-blue-400" />
              <span>{userCount}</span>
            </div>

            {/* Quick Share Link button */}
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white transition ml-0.5"
              title="Copy invite link"
            >
              <FiShare2 size={11} />
            </button>
          </div>

          {/* Room Modal / Popover */}
          {isRoomModalOpen && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 sm:w-80 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl ring-1 ring-white/10 animate-popover z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <FiUsers size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Multiplayer Canvas</h3>
                    <p className="text-[11px] text-neutral-400">
                      {isConnected ? "Connected to live room" : "Disconnected"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    isConnected
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>

              {/* Room details */}
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-neutral-900 border border-white/10 p-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400">Current Room ID</span>
                    <span className="font-mono text-xs font-medium text-white">{roomId || "None"}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleCopyRoom}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-neutral-200 transition"
                      title="Copy room code"
                    >
                      {copied ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition shadow-sm shadow-blue-500/20"
                      title="Copy full invite link"
                    >
                      <FiShare2 size={12} />
                      <span>Link</span>
                    </button>
                  </div>
                </div>

                {/* Join another room */}
                <form onSubmit={handleJoin} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter Room Code..."
                    value={inputRoom}
                    onChange={(e) => setInputRoom(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition active:scale-95 shadow-md shadow-blue-600/20"
                  >
                    <FiZap size={12} />
                    Join
                  </button>
                </form>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition"
                  >
                    <FiPlus size={13} className="text-blue-400" />
                    <span>Create fresh room</span>
                  </button>
                  <span className="text-[11px] text-neutral-500">
                    {userCount} user{userCount > 1 ? "s" : ""} online
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Island: Undo/Redo + Quick Actions + Export */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Undo / Redo Pill */}
          <div className="flex items-center gap-0.5 rounded-2xl border border-white/10 bg-neutral-900/85 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5">
            <button
              onClick={onUndo}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition active:scale-95"
              title="Undo (Ctrl+Z)"
            >
              <MdUndo size={18} />
            </button>
            <button
              onClick={onRedo}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition active:scale-95"
              title="Redo (Ctrl+Y)"
            >
              <MdRedo size={18} />
            </button>
          </div>

          {/* Export PNG button */}
          <button
            onClick={onExportPNG}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 active:scale-95"
            title="Export drawing as high-res PNG image"
          >
            <FiDownload size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Keyboard Shortcuts Help button */}
          <button
            onClick={onOpenShortcuts}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/85 text-neutral-300 hover:bg-white/10 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl ring-1 ring-white/5 transition"
            title="Keyboard shortcuts (?)"
          >
            <FiHelpCircle size={16} />
          </button>
        </div>
      </header>
    </>
  );
};

export default TopBar;
