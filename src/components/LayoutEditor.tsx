'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Move, RotateCcw, Save, X, Grid, Eye, Settings } from 'lucide-react';

export interface WidgetConfig {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isStatic?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

interface LayoutEditorProps {
  widgets: WidgetConfig[];
  onLayoutChange: (widgets: WidgetConfig[]) => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  isEditing: boolean;
}

interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  dragOffset: { x: number; y: number };
  isResizing: boolean;
  resizeHandle: string | null;
}

export default function LayoutEditor({
  widgets,
  onLayoutChange,
  onSave,
  onCancel,
  children,
  isEditing
}: LayoutEditorProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    dragOffset: { x: 0, y: 0 },
    isResizing: false,
    resizeHandle: null
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const gridSize = 20; // Snap to grid

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleMouseDown = useCallback((e: React.MouseEvent, widgetId: string) => {
    e.preventDefault();
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget || widget.isStatic) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Check if we're clicking on a resize handle
    const isResizeHandle = (e.target as HTMLElement).classList.contains('resize-handle');
    const resizeHandle = isResizeHandle ? (e.target as HTMLElement).dataset.handle : null;

    setDragState({
      isDragging: !isResizeHandle,
      draggedId: widgetId,
      dragOffset: { x: offsetX, y: offsetY },
      isResizing: isResizeHandle,
      resizeHandle: resizeHandle || null
    });
  }, [widgets]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.draggedId || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const updatedWidgets = widgets.map(widget => {
      if (widget.id !== dragState.draggedId) return widget;

      if (dragState.isResizing && dragState.resizeHandle) {
        const handle = dragState.resizeHandle;
        let newWidth = widget.width;
        let newHeight = widget.height;
        let newX = widget.x;
        let newY = widget.y;

        switch (handle) {
          case 'se': // Southeast (bottom-right)
            newWidth = snapToGrid(mouseX - widget.x);
            newHeight = snapToGrid(mouseY - widget.y);
            break;
          case 'sw': // Southwest (bottom-left)
            newWidth = snapToGrid(widget.x + widget.width - mouseX);
            newHeight = snapToGrid(mouseY - widget.y);
            newX = snapToGrid(mouseX);
            break;
          case 'ne': // Northeast (top-right)
            newWidth = snapToGrid(mouseX - widget.x);
            newHeight = snapToGrid(widget.y + widget.height - mouseY);
            newY = snapToGrid(mouseY);
            break;
          case 'nw': // Northwest (top-left)
            newWidth = snapToGrid(widget.x + widget.width - mouseX);
            newHeight = snapToGrid(widget.y + widget.height - mouseY);
            newX = snapToGrid(mouseX);
            newY = snapToGrid(mouseY);
            break;
        }

        // Apply constraints
        newWidth = Math.max(widget.minWidth || 200, Math.min(widget.maxWidth || 800, newWidth));
        newHeight = Math.max(widget.minHeight || 150, Math.min(widget.maxHeight || 600, newHeight));

        return { ...widget, x: newX, y: newY, width: newWidth, height: newHeight };
      } else if (dragState.isDragging) {
        // Dragging to move
        const newX = snapToGrid(mouseX - dragState.dragOffset.x);
        const newY = snapToGrid(mouseY - dragState.dragOffset.y);

        return { ...widget, x: Math.max(0, newX), y: Math.max(0, newY) };
      }

      return widget;
    });

    onLayoutChange(updatedWidgets);
  }, [dragState, widgets, onLayoutChange]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      dragOffset: { x: 0, y: 0 },
      isResizing: false,
      resizeHandle: null
    });
  }, []);

  // Add event listeners
  React.useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  const resetLayout = () => {
    // Reset to default positions
    const defaultWidgets = widgets.map((widget, index) => ({
      ...widget,
      x: (index % 3) * 300,
      y: Math.floor(index / 3) * 250,
      width: widget.minWidth || 280,
      height: widget.minHeight || 200
    }));
    onLayoutChange(defaultWidgets);
  };

  if (!isEditing) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="relative">
      {/* Editor Toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Grid className="w-4 h-4" />
            Layout Editor
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            onClick={resetLayout}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Reset to default layout"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`
        }}
      />

      {/* Widget Container */}
      <div 
        ref={containerRef}
        className="relative min-h-screen"
        style={{ paddingTop: '80px' }} // Space for toolbar
      >
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`absolute border-2 ${
              widget.isStatic 
                ? 'border-gray-400 bg-gray-100/50' 
                : 'border-blue-500 bg-blue-50/50 cursor-move'
            } rounded-lg ${
              dragState.draggedId === widget.id ? 'ring-2 ring-blue-400' : ''
            }`}
            style={{
              left: widget.x,
              top: widget.y,
              width: widget.width,
              height: widget.height,
              zIndex: dragState.draggedId === widget.id ? 40 : 10
            }}
            onMouseDown={(e) => handleMouseDown(e, widget.id)}
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 rounded-t-lg border-b">
              <div className="flex items-center gap-2">
                {!widget.isStatic && <Move className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {widget.type}
                  {widget.isStatic && <span className="text-xs text-gray-500 ml-1">(Static)</span>}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {widget.width} × {widget.height}
              </div>
            </div>

            {/* Widget Content Preview */}
            <div className="p-4 h-full bg-white/60 dark:bg-gray-800/60 rounded-b-lg overflow-hidden">
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                {widget.type} Widget
              </div>
            </div>

            {/* Resize Handles (only for non-static widgets) */}
            {!widget.isStatic && (
              <>
                <div 
                  className="resize-handle absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1 -right-1 cursor-se-resize"
                  data-handle="se"
                />
                <div 
                  className="resize-handle absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1 -left-1 cursor-sw-resize"
                  data-handle="sw"
                />
                <div 
                  className="resize-handle absolute w-3 h-3 bg-blue-500 rounded-full -top-1 -right-1 cursor-ne-resize"
                  data-handle="ne"
                />
                <div 
                  className="resize-handle absolute w-3 h-3 bg-blue-500 rounded-full -top-1 -left-1 cursor-nw-resize"
                  data-handle="nw"
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3 max-w-xs">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div className="font-medium mb-2">Layout Editor Instructions:</div>
          <ul className="space-y-1 text-xs">
            <li>• Drag widgets to move them</li>
            <li>• Drag corner handles to resize</li>
            <li>• Static widgets cannot be moved</li>
            <li>• Changes snap to grid ({gridSize}px)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
