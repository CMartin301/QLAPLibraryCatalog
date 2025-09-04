
// src/pages/BooksPage.tsx (Updated with Add Book Modal)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import MediaTable from '../media/MediaTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';
// import BooksSearchFilters from '../components/books/BooksSearchFilters';
// import BooksSortControl, { type SortField, SortDirection } from '../components/books/BooksSortControl';
// import BookCard from '../components/books/BookCard';
// import AddBookModal from '../components/books/AddBookModal';
// import { useAddBookModal } from '../hooks/useAddBookModal';
// import { apiService } from '../services/api';
// import { UserBook, Genre, Author, UserDto } from '../types';
// import BooksTable from '../components/books/BooksTable';
// import { useAuth } from '../hooks/useAuth';

const MyLibraryPage: React.FC = () => {
    const { username, userID } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [media, setMedia] = useState<Media[]>([]);
  
      const [saveMessage, setSaveMessage] = useState<string | null>(null);
    
    useEffect(() => {
      loadMedia();
    }, []);
  
    const loadMedia = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!userID) return;
        
        const response = await mediaService.getUserMedia(userID, true);
        // console.log(response);
        setMedia(response);
      } catch (err: any) {
        setError('Failed to load media');
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <div className="container-fluid py-4 bg-pattern">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
            {username}'s Library
          </h1>
          <p className="text-muted">Manage your library</p>
        </div>
        {/* <div className="col-auto">
          <button 
            className="btn btn-primary-lavender"
            onClick={openModal}
          >
            ➕ Add Book to Your Library
          </button>
        </div> */}
      </div>
      <MediaTable 
                media={media} 
                onRefresh={loadMedia}
                mode='myLibrary'
              />
{/* 
      <div className="mb-4">
        <BooksTable />    
      </div> */}

      {/* Success/Error Alert */}
      {/* {error && (
        <div className="row mb-4">
          <div className="col">
            <div className={`alert ${error.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )} */}
      {/* Lending Section */}
      {/* <div className="row mb-4">
        <div className="col">
          <button 
            className="btn btn-primary-lavender"
            onClick={handleManageBorrowRequests}
          >
            Manage Borrow Requests
          </button>
        </div>
      </div> */}

      {/* Add Book Modal */}
      {/* <AddBookModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onBookAdded={handleBookAdded}
      /> */}
    </div>
  );
};

export default MyLibraryPage;