import React, { useState, useEffect } from "react";
import axios from "axios";

function RouteQuery() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/routes") // Assumes you have a /api/routes endpoint
      .then((res) => {
        setRoutes(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch routes", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoute) return;

    const [
      originSpaceportName,
      originPlanetName,
      destinationSpaceportName,
      destinationPlanetName,
    ] = selectedRoute.split("|");

    try {
      const response = await axios.get(
        "http://localhost:8080/api/flights/route",
        {
          params: {
            originSpaceportName,
            originPlanetName,
            destinationSpaceportName,
            destinationPlanetName,
          },
        }
      );

      const flightList = response.data;
      setFlights(flightList);
      setMessage(
        flightList.length === 0 ? "No flights matched this route." : ""
      );
    } catch (error) {
      console.error("Error fetching flights", error);
      setFlights([]);
      setMessage("Failed to fetch flights.");
    }
  };

  return (
    <div>
      <h1>Route Query</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="route">Select a Route</label>
        <select
          id="route"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          <option value="">-- Select --</option>
          {routes.map((r, idx) => (
            <option
              key={idx}
              value={`${r.originSpaceportName}|${r.originPlanetName}|${r.destinationSpaceportName}|${r.destinationPlanetName}`}
            >
              {r.originSpaceportName} ({r.originPlanetName}) →{" "}
              {r.destinationSpaceportName} ({r.destinationPlanetName})
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
      </form>

      <h2>Flights on This Route</h2>
      {message && <p>{message}</p>}
      <ul>
        {flights.map((f, idx) => (
          <li key={idx}>
            Flight {f.flightNumber} - {f.spacecraftType} - {f.dayOfWeek} -{" "}
            {f.departureTime} - {f.flightTime} hrs
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteQuery;
