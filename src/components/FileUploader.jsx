'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadDesign, deleteDesign, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/storage';

export default function FileUploader({ onFileUploaded, onFileRemoved, maxFiles = 1 }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (fileList) => {
    setErrors([]);
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);

    for (const file of newFiles) {
      // Crear preview local mientras sube
      const localPreview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : null;

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Añadir archivo en estado "uploading"
      setFiles(prev => [...prev, {
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        localPreview,
        status: 'uploading',
        progress: 0
      }]);

      setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));

      // Simular progreso (Supabase no da progreso real)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[tempId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [tempId]: current + 10 };
        });
      }, 200);

      // Subir archivo
      const { data, error } = await uploadDesign(file);
      clearInterval(progressInterval);

      if (error) {
        setErrors(prev => [...prev, `${file.name}: ${error}`]);
        setFiles(prev => prev.filter(f => f.id !== tempId));
        setUploadProgress(prev => {
          const { [tempId]: _, ...rest } = prev;
          return rest;
        });
        continue;
      }

      // Actualizar archivo con datos del servidor
      setFiles(prev => prev.map(f => 
        f.id === tempId 
          ? { ...f, ...data, id: data.path, status: 'uploaded', progress: 100 }
          : f
      ));

      setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

      // Notificar al padre
      if (onFileUploaded) {
        onFileUploaded(data);
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (files.length >= maxFiles) {
      setErrors([`Maximum ${maxFiles} file(s) allowed`]);
      return;
    }

    processFiles(e.dataTransfer.files);
  }, [files.length, maxFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = async (file) => {
    if (file.status === 'uploaded' && file.path) {
      await deleteDesign(file.path);
    }
    
    if (file.localPreview) {
      URL.revokeObjectURL(file.localPreview);
    }

    setFiles(prev => prev.filter(f => f.id !== file.id));
    
    if (onFileRemoved) {
      onFileRemoved(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type?.includes('postscript')) return '🎨';
    return '📁';
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          multiple={maxFiles > 1}
          className="hidden"
          disabled={files.length >= maxFiles}
        />

        <div className="space-y-3">
          <div className="text-4xl">
            {isDragging ? '📥' : '☁️'}
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              {isDragging ? 'Drop your file here' : 'Drag & drop your design'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-gray-400">
            PNG, JPG, SVG, PDF, AI, EPS • Max {MAX_FILE_SIZE / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error, i) => (
            <p key={i} className="text-red-600 text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl"
            >
              {/* Preview or Icon */}
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {file.localPreview || file.url ? (
                  <img
                    src={file.localPreview || file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {file.originalName || file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                
                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.id] || 0}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {file.status === 'uploading' && (
                  <span className="text-sm text-gray-500">Uploading...</span>
                )}
                {file.status === 'uploaded' && (
                  <span className="text-green-500">✓</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Design Guidelines */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-gray-900 text-sm mb-2">📐 Design Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Minimum resolution: 300 DPI for best print quality</li>
          <li>• Vector files (AI, SVG, EPS) recommended for sharp results</li>
          <li>• Include 1/16" bleed for edge-to-edge designs</li>
          <li>• Convert text to outlines to preserve fonts</li>
        </ul>
      </div>
    </div>
  );
}