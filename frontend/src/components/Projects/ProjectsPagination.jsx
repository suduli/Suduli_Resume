import React from 'react';
import './ProjectsPagination.css';
import LazyLoad from '../common/LazyLoad';

const ProjectsPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Create an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <LazyLoad>
      <div className="projects-pagination">
        <button 
          className="pagination-button prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        
        <div className="pagination-numbers">
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
        
        <button 
          className="pagination-button next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </LazyLoad>
  );
};

export default ProjectsPagination;
