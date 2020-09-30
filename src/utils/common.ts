export function getDisplayedPageNumbers({
  pagesCount,
  currentPageNumber,
  maxButtonCount,
}: {
  pagesCount: number;
  currentPageNumber: number;
  maxButtonCount: number;
}) {
  const pageNumbers = [];
  const halfCount = Math.round(maxButtonCount / 2);

  for (let i = 1; i <= pagesCount; i++) {
    if (pageNumbers.length < maxButtonCount) {
      pageNumbers.push(i);
    } else {
      /** currentPageIndex - index of current page in result page number list */
      const currentPageIndex = pageNumbers.indexOf(currentPageNumber);
      if (currentPageIndex + 1 > halfCount || currentPageIndex === -1) {
        pageNumbers.shift();
        pageNumbers.push(i);
      }
    }
  }

  return pageNumbers;
}
