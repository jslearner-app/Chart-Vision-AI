
import React, { useCallback, useState } from 'react';
import { Icon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  onReset: () => void;
}

export const ImageUploader = ({ onImageUpload, imageUrl, onReset }: ImageUploaderProps): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [handleDragEvents, onImageUpload]);

  return (
    <div className="w-full">
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {imageUrl ? (
        <div className="relative group">
           <img src={imageUrl} alt="Chart Preview" className="w-full h-auto rounded-lg object-contain max-h-[400px] border border-slate-200" />
           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <button onClick={onReset} className="bg-white text-slate-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-100">
                    <Icon name="trash" className="w-5 h-5"/>
                    Remove Image
                </button>
           </div>
        </div>
      ) : (
        <div
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
          className={`relative w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'}`}
        >
          <label htmlFor="image-upload" className="flex flex-col items-center justify-center gap-4 cursor-pointer">
            <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                <Icon name="upload" className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-emerald-600' : 'text-slate-500'}`}/>
            </div>
            <p className="text-slate-600 font-semibold">
              <span className="text-emerald-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500">PNG, JPG, or WEBP</p>
          </label>
        </div>
      )}
    </div>
  );
};
