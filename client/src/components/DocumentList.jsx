import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  PlusIcon, 
  FolderIcon,
  CalendarIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents...');
      const response = await axios.get('http://localhost:5000/api/documents');
      console.log('Documents fetched:', response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Refresh documents when component becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDocuments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <div className="mt-4 text-gray-600 text-center">Loading your documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Workspace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, edit, and collaborate on documents in real-time. Your ideas, beautifully organized.
          </p>
        </div>

        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
            
            <Link
              to="/document/new"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="font-semibold">New Document</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <div className="space-y-6">
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link
                  to={`/document/${doc._id}`}
                  className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <EyeIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                                     <div className="space-y-3">
                     <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                       {doc.title || 'Untitled Document'}
                     </h3>
                     
                     {doc.content && (
                       <p className="text-sm text-gray-600 line-clamp-2">
                         {doc.content.length > 100 ? `${doc.content.substring(0, 100)}...` : doc.content}
                       </p>
                     )}
                     
                     <div className="flex items-center gap-4 text-sm text-gray-500">
                       <div className="flex items-center gap-1">
                         <CalendarIcon className="h-4 w-4" />
                         <span>Created {formatDate(doc.createdAt)}</span>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-1 text-sm text-gray-500">
                       <ClockIcon className="h-4 w-4" />
                       <span>Updated {formatDate(doc.updatedAt)}</span>
                     </div>
                   </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        Ready to edit
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl mb-6">
                <DocumentTextIcon className="h-20 w-20 text-blue-400 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? 'No documents found' : 'Start your journey'}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No documents match "${searchTerm}". Try a different search term.`
                  : 'Create your first document and start collaborating with others in real-time.'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/document/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Your First Document
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Section */}
      {documents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-100"
        >
          <div className="text-center">
            <p className="text-gray-600">
              You have <span className="font-semibold text-blue-600">{documents.length}</span> document{documents.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentList;
