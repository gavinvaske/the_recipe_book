import React, { useState, memo } from 'react';
import './PageSelect.scss';

interface Props {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void
  pageSize: number
  numberOfDisplayedRows: number;
  isLoading: boolean;
}


export const PageSelect = memo((props: Props) => {
  const { currentPageIndex, totalPages, onPageChange, onPageSizeChange, pageSize, numberOfDisplayedRows, isLoading } = props;
  const [pageNumberInputField, setPageNumberInputField] = useState<number>(currentPageIndex + 1);
  const [pageSizeInputField, setPageSizeInputField] = useState<number>(pageSize);
  const [errorMessage, setErrorMessage] = useState('');
  const visiblePageNumber = currentPageIndex + 1;
  const isPreviousDisabled = visiblePageNumber === 1;
  const isNextDisabled = visiblePageNumber >= totalPages;

  const maxPageSize = 200;

  const handlePageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (e.key !== 'Enter') return;

    const page = Number(pageNumberInputField);

    if (isNaN(pageSize)) {
      setErrorMessage('Page number must be a number');
      setPageNumberInputField(1);
      return;
    }

    if (page < 1) {
      setErrorMessage(`Page number must be greater than 0`);
      setPageNumberInputField(1);
      return;
    }

    if (page > totalPages) {
      setErrorMessage(`Page number must be less than or equal to ${totalPages}`);
      setPageNumberInputField(totalPages);
      return;
    }

    const pageIndex = page - 1; // Convert page number to zero-based index
    onPageChange(pageIndex);
  };

  const handlePageSizeChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (e.key !== 'Enter') return;

    const pageSize = Number(pageSizeInputField);

    if (isNaN(pageSize)) {
      setErrorMessage('Page size must be a number');
      return;
    }
    
    if ((pageSize < 1)) {
      setErrorMessage(`Page size must be greater than 0`);
      setPageSizeInputField(1);
      return;
    }

    if ((pageSize > maxPageSize)) {
      setErrorMessage(`Page size must be less than or equal to ${maxPageSize}`);
      setPageSizeInputField(maxPageSize);
      return;
    }
    const defaultPageIndex = 0;
    setPageNumberInputField(defaultPageIndex + 1);
    onPageChange(defaultPageIndex);
    setPageSizeInputField(pageSize)
    onPageSizeChange(pageSize);
  };

  const pageNumberDescription = isLoading? 'Loading...': `Page ${visiblePageNumber} of ${totalPages > 0 ? totalPages : 1}`;
  const showingDescription = isLoading ? 'Loading... ' : `Showing ${numberOfDisplayedRows} ${numberOfDisplayedRows === 1 ? 'row' : 'rows'}`

    return (
      <div style={{ marginTop: '1rem' }}>
        <button
            onClick={(e) => onPageChange(currentPageIndex - 1)}
            disabled={isPreviousDisabled}
        >
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>{pageNumberDescription}</span>
        <button
            onClick={(e) => onPageChange(currentPageIndex + 1)}
            disabled={isNextDisabled}
        >
          Next
        </button>
        <div>
          <span className='page-select-error'>{errorMessage}</span>
          <br></br>
          <label htmlFor="page">Go to Page:</label>
          <input 
            name='page'
            type='number'
            value={pageNumberInputField}
            onKeyDown={handlePageChange}
            onChange={(e) => setPageNumberInputField(Number(e.target.value))}
            min={1}
            max={totalPages}
          />
        </div>

        <div>
          <label htmlFor="page">Rows per Page:</label>
          <input 
            name='page' 
            type='number' 
            value={pageSizeInputField} 
            onChange={e => setPageSizeInputField(Number(e.target.value))}
            onKeyDown={handlePageSizeChange}
            min={1}
            max={maxPageSize}
          />
        </div>
        <p>{showingDescription}</p>
      </div>
    )
})
