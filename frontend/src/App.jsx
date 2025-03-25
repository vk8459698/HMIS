import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Fetching");

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then(res => res.text()
    )
      .then(data => setMessage(data));
  }, []);

  return <h1>Hospital Management System :: {message}</h1>;
}

export default App;
