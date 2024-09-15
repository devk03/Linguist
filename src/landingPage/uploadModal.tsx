import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from 'react-router-dom';
import { Id } from '../../convex/_generated/dataModel';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const postVideoData = useMutation(api.messages.postVideoData);
  const navigate = useNavigate();
  const handleUpload = async (file: File) => {
    try {
      const name = file.name;


      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload to storage failed');
      }
      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      const chunkIDs : string[] = [];
      await postVideoData({ videoId: storageId, title: name, chunkIds: chunkIDs });

      console.log('Upload successful');


      onClose();
      // Navigate to the video page after successful upload
      navigate('/video', { state: { videoId: storageId } });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Upload Video</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="video-upload" className="block text-md font-medium text-gray-300 mb-2">
                  Choose a video file
                </label>
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadModal;
