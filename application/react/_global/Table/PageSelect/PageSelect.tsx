import React from 'react';
import './PageSelect.scss';

export const PageSelect = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div style={{ marginTop: '1rem' }}>
        <button
            onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {currentPage} of {totalPages}</span>
        <button
            onClick={() => onPageChange((prev) => prev + 1)}
            disabled={currentPage >= totalPages}
        >
            Next
        </button>
        </div>
    )
}