import React from 'react';
import Icone from './Icone';

interface PaginationFooterProps {
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  label?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({ 
  total = 0, 
  page = 1, 
  pageSize = 10, 
  totalPages = 1, 
  label = 'résultat(s)', 
  onPageChange, 
  onPageSizeChange 
}) => {
  const sizeOptions = [5, 10, 20, 50];

  const buildPages = (current: number, total: number) => {
    if (total <= 0) return [];
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: Array<number | 'ellipsis'> = [1];

    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) {
      start = 2;
      end = 4;
    } else if (current >= total - 2) {
      start = total - 3;
      end = total - 1;
    }

    if (start > 2) {
      pages.push('ellipsis');
    } else {
      for (let i = 2; i < start; i++) pages.push(i);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < total - 1) {
      pages.push('ellipsis');
    } else {
      for (let i = end + 1; i < total; i++) pages.push(i);
    }

    pages.push(total);
    return pages;
  };

  const visiblePages = buildPages(page, totalPages);

  return (
    <div className="tbl-footer">
      <div className="tbl-footer-left">
        <span>{total} {label} &bull; Page {page} / {totalPages}</span>
        <label className="pag-size">
          <span className="pag-size-lbl">Par page</span>
          <select 
            className="pag-size-sel" 
            value={pageSize} 
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {sizeOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="pag-ctrls">
        <button 
          type="button" 
          className="pg-btn" 
          disabled={page === 1} 
          onClick={() => onPageChange(page - 1)}
        >
          <Icone nom="chevron-left" size={14} />
        </button>
        {visiblePages.map((item, idx) => {
          if (item === 'ellipsis') {
            return (
              <span key={`el-${idx}`} className="pg-ellipsis" aria-hidden="true">…</span>
            );
          }
          return (
            <button 
              key={item} 
              type="button" 
              className={`pg-btn ${item === page ? 'on' : ''}`} 
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          );
        })}
        <button 
          type="button" 
          className="pg-btn" 
          disabled={page === totalPages} 
          onClick={() => onPageChange(page + 1)}
        >
          <Icone nom="chevron-right" size={14} />
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter;
