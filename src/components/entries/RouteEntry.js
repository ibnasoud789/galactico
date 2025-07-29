import React, { useState, useEffect } from "react";
import axios from "axios";

function RouteEntry() {
  const [formData, setFormData] = useState({
    originSpaceportName: "",
    originPlanetName: "",
    destinationSpaceportName: "",
    destinationPlanetName: "",
    distance: "",
  });

  const [routes, setRoutes] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchRoutes();
    fetchPlanets();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/routes");
      setRoutes(res.data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setMessage({ text: "Error loading routes", type: "error" });
    }
  };

  const fetchPlanets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/planets");
      setPlanets(res.data);
    } catch (err) {
      console.error("Failed to fetch planets:", err);
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

    const {
      originSpaceportName,
      originPlanetName,
      destinationSpaceportName,
      destinationPlanetName,
      distance,
    } = formData;

    if (
      !originSpaceportName.trim() ||
      !destinationSpaceportName.trim() ||
      !distance.trim()
    ) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (isNaN(distance)) {
      setMessage({ text: "Distance must be a number.", type: "error" });
      return;
    }

    const routePayload = {
      originSpaceportName: originSpaceportName.trim(),
      originPlanetName:
        originPlanetName === "" ? "n/a" : originPlanetName.trim(),
      destinationSpaceportName: destinationSpaceportName.trim(),
      destinationPlanetName:
        destinationPlanetName === "" ? "n/a" : destinationPlanetName.trim(),
      distance: parseInt(distance),
    };

    // Check duplicate route by matching strings
    const isDuplicate = routes.some(
      (r) =>
        r.originSpaceportName?.toLowerCase() ===
          routePayload.originSpaceportName.toLowerCase() &&
        r.originPlanetName?.toLowerCase() ===
          routePayload.originPlanetName.toLowerCase() &&
        r.destinationSpaceportName?.toLowerCase() ===
          routePayload.destinationSpaceportName.toLowerCase() &&
        r.destinationPlanetName?.toLowerCase() ===
          routePayload.destinationPlanetName.toLowerCase()
    );

    if (isDuplicate) {
      setMessage({ text: "This route already exists.", type: "error" });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/routes", routePayload);
      setMessage({ text: "Route added successfully!", type: "success" });
      setFormData({
        originSpaceportName: "",
        originPlanetName: "",
        destinationSpaceportName: "",
        destinationPlanetName: "",
        distance: "",
      });
      fetchRoutes();
    } catch (err) {
      console.error("Failed to add route:", err);
      setMessage({
        text:
          "Error adding route: " + (err.response?.data?.message || err.message),
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1>Route</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="originSpaceportName">Origin Spaceport Name</label>
        <input
          type="text"
          id="originSpaceportName"
          value={formData.originSpaceportName}
          onChange={handleChange}
        />

        <label htmlFor="originPlanetName">Origin Planet</label>
        <select
          id="originPlanetName"
          value={formData.originPlanetName}
          onChange={handleChange}
        >
          <option value="">-- None --</option>
          {planets.map((planet) => (
            <option key={planet.name} value={planet.name}>
              {planet.name}
            </option>
          ))}
        </select>

        <label htmlFor="destinationSpaceportName">
          Destination Spaceport Name
        </label>
        <input
          type="text"
          id="destinationSpaceportName"
          value={formData.destinationSpaceportName}
          onChange={handleChange}
        />

        <label htmlFor="destinationPlanetName">Destination Planet</label>
        <select
          id="destinationPlanetName"
          value={formData.destinationPlanetName}
          onChange={handleChange}
        >
          <option value="">-- None --</option>
          {planets.map((planet) => (
            <option key={planet.name} value={planet.name}>
              {planet.name}
            </option>
          ))}
        </select>

        <label htmlFor="distance">Distance</label>
        <input
          type="text"
          id="distance"
          value={formData.distance}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message.text && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </div>
      )}

      <h2>All Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            From {route.originSpaceportName} ({route.originPlanetName}) to{" "}
            {route.destinationSpaceportName} ({route.destinationPlanetName}) –
            Distance: {route.distance}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteEntry;
