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
      const currentPageIndex = pageNumbers.indexOf(currentPageNumber);
      if (currentPageNumber > halfCount && currentPageIndex !== halfCount) {
        pageNumbers.shift();
        pageNumbers.push(i);
      }
    }
  }

  return pageNumbers;
}
