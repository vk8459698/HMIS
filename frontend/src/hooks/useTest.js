import { useState, useEffect } from "react";
import axios from "axios";

const useTest = () => {
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tests/all") // Fetching from your backend API
      .then((response) => {
        setTestData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { testData, loading, error };
};

export default useTest;
