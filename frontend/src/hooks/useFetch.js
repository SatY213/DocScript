import { useState, useEffect, useCallback } from "react";
import { api } from "../api/api";

const useFetch = (url, query = "", page = 1, otherQueries = "") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});

  const [response, setResponse] = useState(null);
  const perPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fullUrl = `${url}?q=${query}&page=${page}&perPage=${perPage}${
        otherQueries ? `&${otherQueries}` : ""
      }`;
      const res = await api.get(fullUrl);

      if (!res || !res.data) {
        throw new Error("Server error or missing data!");
      }
      setData(res.data.data || []);
      console.log("** Data fetched **");
      setPagination(res.data.pagination || {});
      setStats(res.data.stats || {});
      setResponse(res);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [url, query, page, otherQueries, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setError(false);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    response,
    stats,
    refetch,
  };
};

export default useFetch;
