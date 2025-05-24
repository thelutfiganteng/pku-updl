
import React from "react";

interface ImagePreviewProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function ImagePreview({ open, url, onClose }: ImagePreviewProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl relative p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <img src={url} alt="Preview" className="w-full max-h-[60vh] object-contain rounded-lg" />
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-[#EA384C] bg-white rounded p-2 shadow"
          onClick={onClose}
        >✕</button>
      </div>
    </div>
  );
}
