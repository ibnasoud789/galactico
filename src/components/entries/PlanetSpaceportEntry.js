import React, { useState, useEffect } from "react";
import axios from "axios";

function PlanetSpaceportEntry() {
  const [formData, setFormData] = useState({
    name: "",
    planetName: "",
    capacity: "",
    feePerSeat: "",
  });

  const [spaceports, setSpaceports] = useState([]);

  useEffect(() => {
    fetchSpaceports();
  }, []);

  const fetchSpaceports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/spaceports");
      const planetPorts = res.data.filter((port) => port.station == null);
      setSpaceports(planetPorts);
    } catch (err) {
      console.error("Failed to load spaceports:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const planetName = formData.planetName.trim();
    const capacity = formData.capacity.trim();
    const feePerSeat = formData.feePerSeat.trim();

    if (!name || !planetName || !capacity || !feePerSeat) {
      alert("All fields are required.");
      return;
    }

    if (isNaN(capacity) || isNaN(feePerSeat)) {
      alert("Capacity and Fee Per Seat must be numeric values.");
      return;
    }

    const isDuplicate = spaceports.some(
      (port) =>
        port.name.toLowerCase() === name.toLowerCase() &&
        port.planet?.name.toLowerCase() === planetName.toLowerCase()
    );

    if (isDuplicate) {
      alert("A spaceport with this name already exists on that planet.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/spaceports", {
        name,
        planet: { name: planetName },
        station: null,
        capacity: parseInt(capacity),
        feePerSeat: parseFloat(feePerSeat),
      });

      alert("Planet spaceport added!");
      setFormData({
        name: "",
        planetName: "",
        capacity: "",
        feePerSeat: "",
      });
      fetchSpaceports();
    } catch (err) {
      console.error("Failed to add spaceport:", err);
      alert("Error adding spaceport.");
    }
  };

  return (
    <div>
      <h1>Planet Spaceport Entry</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="planetName">Planet Name</label>
        <input
          type="text"
          id="planetName"
          value={formData.planetName}
          onChange={handleChange}
        />

        <label htmlFor="capacity">Capacity</label>
        <input
          type="text"
          id="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />

        <label htmlFor="feePerSeat">Fee Per Seat</label>
        <input
          type="text"
          id="feePerSeat"
          value={formData.feePerSeat}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      <h2>All Planet Spaceports</h2>
      <ul>
        {spaceports.map((port) => (
          <li key={`${port.name}-${port.planet?.name}`}>
            {port.name} – Planet: {port.planet?.name}, Capacity: {port.capacity}
            , Fee: ${port.feePerSeat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlanetSpaceportEntry;
