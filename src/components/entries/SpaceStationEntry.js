import React, { useState, useEffect } from "react";
import axios from "axios";

function SpaceStationEntry() {
  const [stations, setStations] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    inOrbitOf: "",
    ownedByPlanet: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchStations();
    fetchPlanets();
  }, []);

  const fetchStations = () => {
    axios
      .get("http://localhost:8080/api/spacestations")
      .then((res) => setStations(res.data))
      .catch((err) => {
        console.error("Failed to fetch space stations:", err);
        setMessage({ text: "Error loading space stations", type: "error" });
      });
  };

  const fetchPlanets = () => {
    axios
      .get("http://localhost:8080/api/planets")
      .then((res) => setPlanets(res.data))
      .catch((err) => {
        console.error("Failed to fetch planets:", err);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      inOrbitOf: formData.inOrbitOf === "" ? null : formData.inOrbitOf,
      ownedByPlanet: formData.ownedByPlanet,
    };

    axios
      .post("http://localhost:8080/api/spacestations", payload)
      .then((res) => {
        setStations((prev) => [...prev, res.data]);
        setFormData({ name: "", inOrbitOf: "", ownedByPlanet: "" });
        setMessage({ text: "Space station added!", type: "success" });
      })
      .catch((err) => {
        console.error("Backend error:", err.response?.data || err.message);
        setMessage({
          text:
            "Failed to add space station: " +
            (err.response?.data?.message || err.message),
          type: "error",
        });
      });
  };

  return (
    <div>
      <h1>Space Station</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="inOrbitOf">In Orbit Of (Planet)</label>
        <select
          id="inOrbitOf"
          value={formData.inOrbitOf}
          onChange={handleChange}
        >
          <option value="">None</option>
          {planets.map((planet) => (
            <option key={planet.name} value={planet.name}>
              {planet.name}
            </option>
          ))}
        </select>

        <label htmlFor="ownedByPlanet">Owned By Planet</label>
        <select
          id="ownedByPlanet"
          value={formData.ownedByPlanet}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Planet --</option>
          {planets.map((planet) => (
            <option key={planet.name} value={planet.name}>
              {planet.name}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>

      {message.text && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </div>
      )}

      <h2>All Space Stations</h2>
      <ul>
        {stations.map((station, index) => (
          <li key={index}>
            {station.name} – In Orbit Of: {station.inOrbitOf?.name || "N/A"},
            Owned By: {station.ownedByPlanet?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpaceStationEntry;
