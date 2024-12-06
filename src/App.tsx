import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState<string>("its dead ...");
  function checkHealth() {
    fetch("https://api.workoutmadeeasy.com/health")
      .then((response) => response.json())
      .then((data) => setHealth(data.data));
  }
  useEffect(() => {
    checkHealth();
  }, []);
  return <>{health}</>;
}

export default App;
