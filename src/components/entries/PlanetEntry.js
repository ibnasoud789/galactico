import React, { useState, useEffect } from "react";
import axios from "axios";

function PlanetEntry() {
  const [planets, setPlanets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    population: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = () => {
    axios
      .get("http://localhost:8080/api/planets")
      .then((res) => setPlanets(res.data))
      .catch((err) => {
        console.error("Error fetching planets:", err);
        setMessage({ text: "Failed to fetch planets", type: "error" });
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
      size: parseInt(formData.size),
      population: parseInt(formData.population),
    };

    axios
      .post("http://localhost:8080/api/planets", payload)
      .then((res) => {
        setPlanets((prev) => [...prev, res.data]);
        setFormData({ name: "", size: "", population: "" });
        setMessage({ text: "Planet added successfully!", type: "success" });
      })
      .catch((err) => {
        console.error(
          "Error submitting planet:",
          err.response?.data || err.message
        );
        setMessage({
          text: "Failed to add planet. Please check input and try again.",
          type: "error",
        });
      });
  };

  return (
    <div>
      <h1>Planet</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="size">Size</label>
        <input
          id="size"
          type="number"
          value={formData.size}
          onChange={handleChange}
          required
        />

        <label htmlFor="population">Population</label>
        <input
          id="population"
          type="number"
          value={formData.population}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {message.text && (
        <div
          className={
            message.type === "success" ? "success-message" : "error-message"
          }
          style={{ color: message.type === "success" ? "green" : "red" }}
        >
          {message.text}
        </div>
      )}

      <h2>All Planets</h2>
      <ul>
        {planets.map((planet) => (
          <li key={planet.name}>
            {planet.name} – Size: {planet.size}, Population: {planet.population}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlanetEntry;
