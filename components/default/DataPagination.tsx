import { NextPage } from 'next';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  lastPage?: number;
}
const getVisiblePages = (
  current: number,
  total: number,
): (number | '...')[] => {
  if (total <= 1) return [1];
  if (total <= 5) return [...Array(total)].map((_, i) => i + 1);

  const pages: (number | '...')[] = [];
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }
  const middlePages = [current - 1, current, current + 1].filter(
    (page) => page > 1 && page < total,
  );

  pages.push(...middlePages);
  if (current < total - 2) {
    pages.push('...');
  }
  pages.push(total);

  return pages;
};

export const DataPagination: NextPage<Props> = ({
  page,
  setPage,
  lastPage = 1,
}) => {
  const pages = getVisiblePages(page, lastPage);
  useEffect(() => {
    const el = document.getElementById('sidebar-inset');
    if (el) {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);
  return (
    <>
      {setPage && (
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                />
              </PaginationItem>

              {pages.map((p, idx) =>
                p === '...' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setPage(Math.min(lastPage, page + 1))}
                  aria-disabled={page === lastPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};
