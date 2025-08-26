"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera, User } from "lucide-react";

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export default function ProfilePictureUpload({
  currentAvatar,
  onUpload,
  onRemove,
  isLoading = false
}: ProfilePictureUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent handler
    onUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Profile Picture
        </h3>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
          dragActive
            ? "border-pink-400 bg-pink-50 dark:bg-pink-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          // Image Preview
          <div className="relative">
            <img
              src={preview}
              alt="Profile preview"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Upload Prompt
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop your profile picture here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-pink-500 hover:text-pink-600 font-medium"
                disabled={isLoading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG up to 5MB
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        )}
      </div>

      {/* Upload Button (alternative) */}
      {!preview && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Choose Profile Picture
        </button>
      )}
    </div>
  );
}
