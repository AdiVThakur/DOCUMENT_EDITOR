import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const socket = io('http://localhost:5000');

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [collaborators, setCollaborators] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content || '');
        setLastSaved(new Date(response.data.updatedAt));
        socket.emit('join-document', id);
      } catch (error) {
        console.error('Error fetching document:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id !== 'new') {
      fetchDocument();
    } else {
      setLoading(false);
    }

    return () => {
      socket.off('receive-changes');
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    socket.on('receive-changes', (delta) => {
      setContent((prevContent) => {
        // Apply the changes from other users
        return delta;
      });
    });

    socket.on('user-joined', () => {
      setCollaborators(prev => prev + 1);
    });

    socket.on('user-left', () => {
      setCollaborators(prev => Math.max(1, prev - 1));
    });

    return () => {
      socket.off('receive-changes');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, []);

  const handleEditorChange = useCallback((value) => {
    if (value !== undefined) {
      setContent(value);
      socket.emit('send-changes', value);
      
      // Auto-save after 2 seconds of no typing
      if (id !== 'new') {
        clearTimeout(autoSaveTimeout.current);
        autoSaveTimeout.current = setTimeout(() => {
          handleAutoSave(value);
        }, 2000);
      }
    }
  }, [id]);

  const autoSaveTimeout = useRef(null);

  const handleAutoSave = async (content) => {
    if (id === 'new') return;
    
    try {
      console.log('Auto-saving document...');
      await axios.post(`http://localhost:5000/api/documents/${id}`, {
        content
      });
      setLastSaved(new Date());
      setSaveMessage('Auto-saved');
      setTimeout(() => setSaveMessage(''), 2000);
      console.log('Document auto-saved successfully');
    } catch (error) {
      console.error('Error auto-saving document:', error);
      setSaveMessage('Auto-save failed');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSave = async () => {
    console.log('Save button clicked. ID:', id, 'Title:', title, 'Content length:', content.length);
    
    if (id === 'new') {
      try {
        setSaving(true);
        console.log('Creating new document...');
        const response = await axios.post('http://localhost:5000/api/documents', {
          title: title || 'Untitled Document',
          content
        });
        console.log('Document created successfully:', response.data);
        setLastSaved(new Date());
        setSaveMessage('Document created successfully!');
        setTimeout(() => {
          navigate(`/document/${response.data._id}`);
        }, 1000);
      } catch (error) {
        console.error('Error creating document:', error);
        console.error('Error details:', error.response?.data);
      } finally {
        setSaving(false);
      }
    } else {
      try {
        setSaving(true);
        console.log('Updating existing document...');
        const response = await axios.post(`http://localhost:5000/api/documents/${id}`, {
          content
        });
        console.log('Document updated successfully:', response.data);
        setLastSaved(new Date());
        setSaveMessage('Document saved successfully!');
        setTimeout(() => setSaveMessage(''), 2000);
      } catch (error) {
        console.error('Error saving document:', error);
        console.error('Error details:', error.response?.data);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your document...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Document"
                  className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status Indicators */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{collaborators} active</span>
                </div>
                {lastSaved && (
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-md"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Save Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm"
          >
            {saving ? (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
                <span>Saving changes...</span>
              </div>
            ) : saveMessage ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>{saveMessage}</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>All changes saved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>Ready to save</span>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="h-[calc(100vh-280px)]">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
              }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time collaboration active</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>{collaborators} collaborator{collaborators !== 1 ? 's' : ''} online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DocumentEditor;
