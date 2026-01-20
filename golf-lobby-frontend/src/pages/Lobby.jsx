import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import PlayerList from "../components/PlayerList";

export default function Lobby() {
  const { id } = useParams();
  const location = useLocation();
  const time = location.state?.time;
  const [players, setPlayers] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeeTime = async () => {
    console.log("Fetching tee time for course", id, "time", time);
    try {
      const response = await fetch(`http://localhost:3003/tee-time?course_id=${id}&time=${encodeURIComponent(time)}`);
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Data:", data);
      setPlayers(data.players);
      setIsFull(data.is_full);
    } catch (error) {
      console.error("Error fetching tee time:", error);
    }
  };

  useEffect(() => {
    if (time) {
      fetchTeeTime();
    } else {
      console.log("No time in state");
    }
  }, [id, time]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    console.log("Joining with name:", name.trim(), "course_id:", parseInt(id), "time:", time);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3003/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), course_id: parseInt(id), time }),
      });
      console.log("Join response status:", response.status);
      if (response.ok) {
        const result = await response.json();
        console.log("Joined:", result);
        setName("");
        fetchTeeTime(); // Refresh the data
      } else {
        const error = await response.json();
        console.error("Join error:", error);
        alert(error.detail);
      }
    } catch (error) {
      console.error("Error joining:", error);
      alert("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="macbook-pro">
      <h1 className="text-wrapper">Virtual Lobby for {time}</h1>
      <PlayerList players={players.map((name, index) => ({ id: index + 1, name }))} />

      <p className="text-wrapper">{players.length}/4 players joined</p>

      {!isFull && players.length < 4 && (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="player-input"
          />
          <button onClick={handleJoin} disabled={loading}>
            {loading ? "Joining..." : "Join Tee Time"}
          </button>
        </div>
      )}

      {isFull ? (
        <p>Tee time is full and locked!</p>
      ) : players.length === 4 ? (
        <p>Tee time is now full!</p>
      ) : (
        <p>Waiting for more players...</p>
      )}
    </div>
  );
}
