import React, { useState, useEffect } from "react";
import axios from "axios";

function StationSpaceportEntry() {
  const [formData, setFormData] = useState({
    stationName: "",
    capacity: "",
    feePerSeat: "",
  });

  const [spaceports, setSpaceports] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchStationSpaceports();
  }, []);

  const fetchStationSpaceports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/spaceports");
      const stationPorts = res.data.filter((port) => port.station !== null);
      setSpaceports(stationPorts);
    } catch (err) {
      console.error("Failed to load station spaceports:", err);
      setMessage({ text: "Failed to load station spaceports", type: "error" });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { stationName, capacity, feePerSeat } = formData;

    if (!stationName.trim() || !capacity.trim() || !feePerSeat.trim()) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (isNaN(capacity) || isNaN(feePerSeat)) {
      setMessage({ text: "Capacity and Fee must be numeric.", type: "error" });
      return;
    }

    const isDuplicate = spaceports.some(
      (p) => p.station?.name.toLowerCase() === stationName.toLowerCase().trim()
    );

    if (isDuplicate) {
      setMessage({
        text: "A spaceport already exists for this station.",
        type: "error",
      });
      return;
    }

    const payload = {
      name: stationName,
      planet: { name: "n/a" }, // matches your backend requirement
      station: { name: stationName },
      capacity: parseInt(capacity),
      feePerSeat: parseFloat(feePerSeat),
    };

    try {
      await axios.post("http://localhost:8080/api/spaceports", payload);
      setMessage({ text: "Station spaceport added!", type: "success" });
      setFormData({ stationName: "", capacity: "", feePerSeat: "" });
      fetchStationSpaceports();
    } catch (err) {
      console.error("Submission failed:", err);
      setMessage({
        text: "Failed to submit station spaceport.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1>Station Spaceport</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="stationName">Station Name</label>
        <input
          type="text"
          id="stationName"
          value={formData.stationName}
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

      {message.text && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </div>
      )}

      <h2>All Station Spaceports</h2>
      <ul>
        {spaceports.map((port) => (
          <li key={port.station?.name}>
            {port.station?.name} – Capacity: {port.capacity}, Fee: $
            {port.feePerSeat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StationSpaceportEntry;
