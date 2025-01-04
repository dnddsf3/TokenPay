import { useState, useEffect } from "react";

export const usePagination = (initialData: any[], resultsPerPage: number) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(initialData); // Store filtered data
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, page, resultsPerPage]);

  return { page, setPage, paginatedData, setData };
};
