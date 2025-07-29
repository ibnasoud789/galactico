import React, { useState, useEffect } from "react";
import axios from "axios";

function FlightFinder() {
  const [spaceports, setSpaceports] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00:00");
  const [maxStops, setMaxStops] = useState(0);
  const [maxTotalHours, setMaxTotalHours] = useState(24);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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
    axios
      .get("http://localhost:8080/api/spaceports")
      .then((res) => setSpaceports(res.data))
      .catch((err) => console.error("Error fetching spaceports", err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    if (!origin || !destination) {
      setError("Select origin, destination, and day of week");
      return;
    }
    setError("");
    setLoading(true);
    const [originName, originPlanet] = origin.split("|");
    const [destName, destPlanet] = destination.split("|");
    try {
      const res = await axios.get(
        "http://localhost:8080/api/flights/itineraries",
        {
          params: {
            originSpaceportName: originName,
            originPlanetName: originPlanet,
            destSpaceportName: destName,
            destPlanetName: destPlanet,
            dayOfWeek,
            startTime,
            maxStops,
            maxTotalHours,
          },
        }
      );
      setItineraries(res.data);
    } catch (err) {
      console.error("Error fetching itineraries", err);
      setError("Error fetching itineraries");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-finder">
      <h1>Flight Finder</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch}>
        <label>Origin:</label>
        <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
          <option value="">--Select Origin--</option>
          {spaceports.map((sp) => {
            const planet = sp.planetName ?? sp.planet?.name ?? "";
            return (
              <option
                key={`${sp.name}|${planet}`}
                value={`${sp.name}|${planet}`}
              >
                {`${sp.name} (${planet})`}
              </option>
            );
          })}
        </select>

        <label>Destination:</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="">--Select Destination--</option>
          {spaceports.map((sp) => {
            const planet = sp.planetName ?? sp.planet?.name ?? "";
            return (
              <option
                key={`${sp.name}|${planet}`}
                value={`${sp.name}|${planet}`}
              >
                {`${sp.name} (${planet})`}
              </option>
            );
          })}
        </select>

        <label>Day of Week:</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          {daysOfWeek.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label>Start Time:</label>
        <input
          type="time"
          step="1"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label>Max Stops:</label>
        <input
          type="number"
          min="0"
          value={maxStops}
          onChange={(e) => setMaxStops(parseInt(e.target.value, 10))}
        />

        <label>Max Total Hours:</label>
        <input
          type="number"
          step="0.1"
          value={maxTotalHours}
          onChange={(e) => setMaxTotalHours(parseFloat(e.target.value))}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && (
        <div className="results">
          <h2>Results</h2>
          {itineraries.length === 0 ? (
            <p>No itineraries found.</p>
          ) : (
            itineraries.map((path, idx) => (
              <div key={idx} className="itinerary">
                <h3>Itinerary {idx + 1}</h3>
                <ul>
                  {path.map((f) => (
                    <li key={f.flightNumber}>
                      <strong>{f.flightNumber}</strong>: {f.originSpaceportName}{" "}
                      → {f.destinationSpaceportName}, departs {f.departureTime},{" "}
                      {f.flightTime}h
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default FlightFinder;
