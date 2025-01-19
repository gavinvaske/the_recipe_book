import React from 'react';
import './PageSelect.scss';

interface Props {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (e: number) => void;
  onPageSizeChange: (e: number) => void
  pageSize: number
}

export const PageSelect = (props: Props) => {
  const { currentPageIndex, totalPages, onPageChange, onPageSizeChange, pageSize } = props;
  const visiblePageNumber = currentPageIndex + 1;
  const isPreviousDisabled = visiblePageNumber === 1;
  const isNextDisabled = visiblePageNumber >= totalPages;

    return (
      <div style={{ marginTop: '1rem' }}>
        <button
            onClick={(e) => onPageChange(currentPageIndex - 1)}
            disabled={isPreviousDisabled}
        >
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {visiblePageNumber} of {totalPages}</span>
        <button
            onClick={(e) => onPageChange(currentPageIndex + 1)}
            disabled={isNextDisabled}
        >
          Next
        </button>
        <div>
          <label htmlFor="page">Jump to Page:</label>
          <input name='page' type='number' value={visiblePageNumber} onChange={e => onPageChange(Number(e.current.value) - 1)} min={1} max={totalPages} />
        </div>

        <div>
          <label htmlFor="page">Results per Page:</label>
          <input name='page' type='number' value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} min={1} max={200} />
        </div>

        <p>Showing {'TODO: Make this work with partial pages'}, results of {totalPages * pageSize}</p>
      </div>
    )
}
