import React, { useState, useEffect } from "react";
import axios from "axios";

function FlightEntry() {
  const [formData, setFormData] = useState({
    flightNumber: "",
    selectedRouteIndex: "",
    spacecraftType: "",
    dayOfWeek: "",
    departureTime: "",
    flightTime: "",
  });

  const [routes, setRoutes] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchFlights();
    fetchRoutes();
    fetchSpacecrafts();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/flights");
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights:", err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/routes");
      setRoutes(res.data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    }
  };

  const fetchSpacecrafts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/spacecraft");
      setSpacecrafts(res.data);
    } catch (err) {
      console.error("Failed to fetch spacecrafts:", err);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      flightNumber,
      selectedRouteIndex,
      spacecraftType,
      dayOfWeek,
      departureTime,
      flightTime,
    } = formData;

    if (
      !flightNumber.trim() ||
      selectedRouteIndex === "" ||
      !spacecraftType ||
      !dayOfWeek ||
      !departureTime.trim() ||
      !flightTime.trim()
    ) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (isNaN(flightTime)) {
      setMessage({ text: "Flight time must be a number.", type: "error" });
      return;
    }

    const route = routes[parseInt(selectedRouteIndex)];
    if (!route) {
      setMessage({ text: "Invalid route selected.", type: "error" });
      return;
    }

    const payload = {
      flightNumber: flightNumber.trim(),
      originSpaceportName: route.originSpaceportName,
      originPlanetName: route.originPlanetName,
      destinationSpaceportName: route.destinationSpaceportName,
      destinationPlanetName: route.destinationPlanetName,
      spacecraftType,
      dayOfWeek,
      departureTime: departureTime.trim(),
      flightTime: parseFloat(flightTime),
    };

    try {
      await axios.post("http://localhost:8080/api/flights", payload);
      setMessage({ text: "Flight added successfully!", type: "success" });
      setFormData({
        flightNumber: "",
        selectedRouteIndex: "",
        spacecraftType: "",
        dayOfWeek: "",
        departureTime: "",
        flightTime: "",
      });
      fetchFlights();
    } catch (err) {
      console.error("Failed to add flight:", err);
      const backendMessage =
        err.response?.data?.message || err.response?.data || err.message;
      setMessage({
        text: "Error adding flight: " + backendMessage,
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1>Flight</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="flightNumber">Flight Number</label>
        <input
          type="text"
          id="flightNumber"
          value={formData.flightNumber}
          onChange={handleChange}
        />

        <label htmlFor="selectedRouteIndex">Route</label>
        <select
          id="selectedRouteIndex"
          value={formData.selectedRouteIndex}
          onChange={handleChange}
        >
          <option value="">-- Select Route --</option>
          {routes.map((route, index) => (
            <option key={index} value={index}>
              {route.originSpaceportName} ({route.originPlanetName}) →{" "}
              {route.destinationSpaceportName} ({route.destinationPlanetName})
            </option>
          ))}
        </select>

        <label htmlFor="spacecraftType">Spacecraft Type</label>
        <select
          id="spacecraftType"
          value={formData.spacecraftType}
          onChange={handleChange}
        >
          <option value="">-- Select Spacecraft --</option>
          {spacecrafts.map((craft) => (
            <option key={craft.typeName} value={craft.typeName}>
              {craft.typeName}
            </option>
          ))}
        </select>

        <label htmlFor="dayOfWeek">Day of Week</label>
        <select
          id="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
        >
          <option value="">-- Select Day --</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label htmlFor="departureTime">Departure Time (HH:mm)</label>
        <input
          type="text"
          id="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
        />

        <label htmlFor="flightTime">Flight Time (hours)</label>
        <input
          type="text"
          id="flightTime"
          value={formData.flightTime}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message.text && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </div>
      )}

      <h2>All Flights</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight.flightNumber}>
            Flight {flight.flightNumber}: {flight.originSpaceportName} (
            {flight.originPlanetName}) → {flight.destinationSpaceportName} (
            {flight.destinationPlanetName}) using {flight.spacecraftType} on{" "}
            {flight.dayOfWeek} at {flight.departureTime}, Flight Time:{" "}
            {flight.flightTime} hrs
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlightEntry;
