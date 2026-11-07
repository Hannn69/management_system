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

/** Turns the cells of an HTML table into CSV text, so Export always matches what is on screen. */
export function tableToCsv(table: HTMLTableElement) {
  const clean = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();
  const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = [...table.rows]
    .map((row) => [...row.cells].map((cell) => clean(cell.textContent)))
    .filter((cells) => cells.some(Boolean));
  return rows.map((cells) => cells.map(quote).join(",")).join("\r\n");
}

function exportVisibleTable() {
  const table = document.querySelector<HTMLTableElement>("main table");
  if (!table) return;
  const blob = new Blob(["﻿" + tableToCsv(table)], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const page = window.location.pathname.split("/").filter(Boolean).pop() || "export";
  link.download = `${page}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
}

export function DataTableToolbar({
  search,
  onSearchChange,
  onViewToggle,
  onColumnToggle,
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
    <div className="flex flex-col gap-4 bg-gray-100/50 p-4 rounded-xl border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex flex-1 max-w-md items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-500" />
          <input
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500/50 focus:outline-none transition-all"
            placeholder="Search records..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
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
        <div className="hidden sm:flex items-center rounded-xl border border-gray-200 bg-white p-1">
          <button
            onClick={() => onViewToggle?.("list")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 "}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewToggle?.("grid")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 "}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        {showAdvancedSearch && onAdvancedSearchClick && (
          <button
            onClick={onAdvancedSearchClick}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-foreground transition-all"
          >
            <Filter className="h-4 w-4 text-blue-500" />
            <span>Advanced Search</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Utility Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
          <button 
            onClick={onRefreshClick}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-foreground transition-all" 
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button 
            onClick={onPrintClick ?? (() => window.print())}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-foreground transition-all" 
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button 
            onClick={onExportClick ?? exportVisibleTable}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-foreground transition-all" 
            title="Export Data"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={onFullscreenClick ?? toggleFullscreen}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-foreground transition-all" 
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Columns & Deleted Items */}
        <div className="flex items-center gap-2">
          {onColumnToggle && (
          <button
            onClick={onColumnToggle}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-foreground transition-all"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Columns</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          )}

          {onDeletedItemsClick && (
          <button
            onClick={onDeletedItemsClick}
            className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden lg:inline">Deleted</span>
          </button>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New</span>
        </button>
      </div>
    </div>
  );
}
