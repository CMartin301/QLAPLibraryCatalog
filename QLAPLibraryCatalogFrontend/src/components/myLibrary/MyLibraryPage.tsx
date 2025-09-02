
// src/pages/BooksPage.tsx (Updated with Add Book Modal)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import BookTable from '../books/BookTable';
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const { username, logout } = useAuth();
  
  // Data state
//   const [allUserBooks, setAllUserBooks] = useState<UserBook[]>([]);
//   const [genres, setGenres] = useState<Genre[]>([]);
//   const [authors, setAuthors] = useState<Author[]>([]);
//   const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  

  // Add Book Modal
//   const { isModalOpen, openModal, closeModal, handleBookAdded } = useAddBookModal({
//     onBookAdded: (newBook) => {
//       // Add the new book to the list and show success message
//       setAllUserBooks(prev => [newBook, ...prev]);
//       setError(null);
//       // Show success message
//       setTimeout(() => {
//         setError('✅ Book added successfully to your collection!');
//         setTimeout(() => setError(null), 3000);
//       }, 100);
//     }
//   });

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const [userBooksData, genresData, authorsData, currentUserData] = await Promise.all([
//           apiService.getAvailableBooks(), // This should return all user books, not just available ones
//           apiService.getGenres(),
//           apiService.getAuthors(),
//           apiService.getCurrentUser()
//         ]);

//         setAllUserBooks(userBooksData.data || []);
//         setGenres(genresData);
//         setAuthors(authorsData);
//         setCurrentUser(currentUserData);
//       } catch (err) {
//         console.error('Failed to load books data:', err);
//         setError('Failed to load books. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Reset pagination when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, selectedGenre, selectedAuthor, availableOnly, showMyBooks]);

//   const handleManageBorrowRequests = () => {
//     navigate(`/requests`);
//   };


//   if (isLoading) {
//     return (
//       <div className="container-fluid py-4">
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
//           <div className="spinner-border spinner-custom" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

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
      <BookTable />
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