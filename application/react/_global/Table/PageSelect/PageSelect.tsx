import React from 'react';
import './PageSelect.scss';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (e: number) => void;
  onPageSizeChange: (e: number) => void
  pageSize: number
}

const isValidPage = (page: number, totalPages: number): boolean => {
  return page >= 1 && page <= totalPages;
}

export const PageSelect = (props: Props) => {
  const { currentPage, totalPages, onPageChange, onPageSizeChange, pageSize } = props;
  console.log(props)
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage >= totalPages;

    return (
      <div style={{ marginTop: '1rem' }}>
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isPreviousDisabled}
        >
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {currentPage} of {totalPages}</span>
        <button
            onClick={(e) => onPageChange((currentPage + 1 <= totalPages) ? currentPage + 1 : totalPages)}
            disabled={isNextDisabled}
        >
          Next
        </button>
        <div>
          <label htmlFor="page">Jump to Page:</label>
          <input name='page' type='number' value={currentPage} onChange={e => onPageChange(e.current.value)} min={1} max={totalPages} />
        </div>

        <div>
          <label htmlFor="page">Results per Page:</label>
          <input name='page' type='number' value={pageSize} onChange={e => onPageSizeChange(e.current.value)} min={1} max={200} />
        </div>

        <p>Showing {'TODO: Make this work with partial pages'}, results of {totalPages * pageSize}</p>
      </div>
    )
}
