"use client";

import React from "react";
import { 
  Search, 
  Settings2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Printer, 
  Download, 
  Maximize2, 
  List, 
  LayoutGrid,
  ChevronDown,
  Filter,
  ArrowUpAZ,
  ArrowDownAZ
} from "lucide-react";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSortClick?: () => void;
  onViewToggle?: (view: "list" | "grid") => void;
  onColumnToggle?: () => void;
  onCreateClick?: () => void;
  onDeletedItemsClick?: () => void;
  onRefreshClick?: () => void;
  onPrintClick?: () => void;
  onExportClick?: () => void;
  onFullscreenClick?: () => void;
  onAdvancedSearchClick?: () => void;
  viewType?: "list" | "grid";
  showAdvancedSearch?: boolean;
  sortOrder?: "asc" | "desc";
  onSortOrderChange?: (order: "asc" | "desc") => void;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  onViewToggle,
  onCreateClick,
  onDeletedItemsClick,
  onRefreshClick,
  onPrintClick,
  onExportClick,
  onFullscreenClick,
  onAdvancedSearchClick,
  viewType = "list",
  showAdvancedSearch = false,
  sortOrder = "desc",
  onSortOrderChange
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 bg-slate-100/50 dark:bg-[#111b24]/50 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex flex-1 max-w-md items-center">
          <Search className="absolute left-3 h-4 w-4 text-zinc-500" />
          <input
            className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] pl-10 pr-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none transition-all"
            placeholder="Search records..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95"
          title={`Sort Order: ${sortOrder === "asc" ? "Oldest First" : "Latest First"}`}
        >
          {sortOrder === "asc" ? (
            <ArrowUpAZ className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownAZ className="h-4 w-4 text-rose-500" />
          )}
          <span className="hidden md:inline uppercase tracking-wider">
            {sortOrder === "desc" ? "Latest" : "Old"}
          </span>
        </button>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] p-1">
          <button
            onClick={() => onViewToggle?.("list")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-[#2ca6a4] text-white shadow-lg" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewToggle?.("grid")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-[#2ca6a4] text-white shadow-lg" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        {showAdvancedSearch && (
          <button
            onClick={onAdvancedSearchClick}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all"
          >
            <Filter className="h-4 w-4 text-cyan-500" />
            <span>Advanced Search</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Utility Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] p-1">
          <button 
            onClick={onRefreshClick}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all" 
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button 
            onClick={onPrintClick}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all" 
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button 
            onClick={onExportClick}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all" 
            title="Export Data"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={onFullscreenClick}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all" 
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Columns & Deleted Items */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#16232d] px-3 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-all"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Columns</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          
          <button
            onClick={onDeletedItemsClick}
            className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden lg:inline">Deleted</span>
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-xl bg-[#2ca6a4] px-4 py-2.5 text-xs font-bold text-white shadow-[0_15px_30px_-12px_rgba(44,166,164,0.4)] hover:bg-[#258e8c] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New</span>
        </button>
      </div>
    </div>
  );
}
