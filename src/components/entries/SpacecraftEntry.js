import React, { useState, useEffect } from "react";
import axios from "axios";

function SpacecraftEntry() {
  const [formData, setFormData] = useState({
    typeName: "",
    capacity: "",
    range: "",
  });

  const [spacecrafts, setSpacecrafts] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchSpacecrafts();
  }, []);

  const fetchSpacecrafts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/spacecraft");
      setSpacecrafts(res.data);
    } catch (err) {
      console.error("Failed to fetch spacecraft:", err);
      setMessage({ text: "Error loading spacecraft list", type: "error" });
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

    const { typeName, capacity, range } = formData;

    if (!typeName.trim() || !capacity.trim() || !range.trim()) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (isNaN(capacity) || isNaN(range)) {
      setMessage({
        text: "Capacity and Range must be numbers.",
        type: "error",
      });
      return;
    }

    const isDuplicate = spacecrafts.some(
      (c) => c.typeName.toLowerCase() === typeName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setMessage({
        text: "This spacecraft type already exists.",
        type: "error",
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/spacecraft", {
        typeName: typeName.trim(),
        capacity: parseInt(capacity),
        craftRange: parseInt(range),
      });

      setMessage({ text: "Spacecraft added successfully!", type: "success" });
      setFormData({ typeName: "", capacity: "", range: "" });
      fetchSpacecrafts();
    } catch (err) {
      console.error("Failed to add spacecraft:", err);
      setMessage({
        text:
          "Error adding spacecraft: " +
          (err.response?.data?.message || err.message),
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1>Spacecraft</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="typeName">Type Name</label>
        <input
          type="text"
          id="typeName"
          value={formData.typeName}
          onChange={handleChange}
        />

        <label htmlFor="capacity">Capacity</label>
        <input
          type="text"
          id="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />

        <label htmlFor="range">Range</label>
        <input
          type="text"
          id="range"
          value={formData.range}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message.text && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </div>
      )}

      <h2>All Spacecraft</h2>
      <ul>
        {spacecrafts.map((craft) => (
          <li key={craft.typeName}>
            {craft.typeName} – Capacity: {craft.capacity}, Range:{" "}
            {craft.craftRange}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpacecraftEntry;
