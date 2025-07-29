import React, { useState, useEffect } from "react";
import axios from "axios";

function SpaceportQuery() {
  const [spaceports, setSpaceports] = useState([]);
  const [flightsList, setFlightsList] = useState([]);
  const [spaceportName, setSpaceportName] = useState("");
  const [planetName, setPlanetName] = useState("");
  const [connectedPorts, setConnectedPorts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departures, setDepartures] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [searchedFlights, setSearchedFlights] = useState(false);

  // Load all spaceports and all flights
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/spaceports")
      .then((res) => setSpaceports(res.data))
      .catch((err) => console.error("Failed to fetch spaceports", err));
    axios
      .get("http://localhost:8080/api/flights")
      .then((res) => setFlightsList(res.data))
      .catch((err) => console.error("Failed to fetch flights list", err));
  }, []);

  // Fetch connected ports on select
  useEffect(() => {
    if (!spaceportName) {
      setConnectedPorts([]);
      return;
    }
    const port = spaceports.find((p) => p.name === spaceportName);
    const planet = port?.planet?.name;
    setPlanetName(planet || "");

    // Compute current week's Mon-Sun
    const today = new Date();
    const diffToMon = (today.getDay() + 6) % 7;
    const mon = new Date(today);
    mon.setDate(today.getDate() - diffToMon);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const sd = mon.toISOString().slice(0, 10);
    const ed = sun.toISOString().slice(0, 10);
    setStartDate(sd);
    setEndDate(ed);

    setLoadingConnections(true);
    axios
      .get("http://localhost:8080/api/spaceports/traffic", {
        params: {
          spaceportName,
          planetName: planet,
          startDate: sd,
          endDate: ed,
        },
      })
      .then((res) => {
        const unique = Array.from(
          new Map(
            res.data.connectedSpaceports.map((p) => [
              `${p.name}-${p.planetName}`,
              p,
            ])
          ).values()
        );
        setConnectedPorts(unique);
      })
      .catch((err) => console.error("Error fetching connections", err))
      .finally(() => setLoadingConnections(false));
  }, [spaceportName, spaceports]);

  const handleSearchFlights = async (e) => {
    e.preventDefault();
    setLoadingFlights(true);
    setSearchedFlights(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/spaceports/traffic",
        {
          params: { spaceportName, planetName, startDate, endDate },
        }
      );
      let deps = res.data.departures;
      let arrs = res.data.arrivals;

      // merge in full flight data from flightsList
      const detailsMap = flightsList.reduce((map, f) => {
        map[f.flightNumber] = f;
        return map;
      }, {});
      deps = deps.map((f) => ({ ...f, ...detailsMap[f.flightNumber] }));
      arrs = arrs.map((f) => ({ ...f, ...detailsMap[f.flightNumber] }));

      setDepartures(deps);
      setArrivals(arrs);
    } catch (err) {
      console.error("Error fetching flights", err);
      const msg = err.response?.data || err.message;
      alert(`Error fetching flights: ${JSON.stringify(msg)}`);
    } finally {
      setLoadingFlights(false);
    }
  };

  const formatDateTime = (iso) => {
    const dt = new Date(iso);
    return {
      date: dt.toISOString().slice(0, 10),
      time: dt.toISOString().slice(11, 19),
    };
  };

  return (
    <div>
      <h1>Spaceport Query</h1>

      <label>Spaceport</label>
      <select
        value={spaceportName}
        onChange={(e) => setSpaceportName(e.target.value)}
      >
        <option value="">Select a spaceport</option>
        {spaceports.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name} ({p.planet?.name})
          </option>
        ))}
      </select>

      {loadingConnections && <p>Loading connected spaceports...</p>}
      {!loadingConnections && connectedPorts.length > 0 && (
        <div>
          <h2>Connected Spaceports</h2>
          <ul>
            {connectedPorts.map((sp) => (
              <li key={`${sp.name}-${sp.planetName}`}>
                {sp.name} ({sp.planetName})
              </li>
            ))}
          </ul>
        </div>
      )}

      {spaceportName && (
        <form onSubmit={handleSearchFlights}>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button type="submit" disabled={loadingFlights}>
            {loadingFlights ? "Loading..." : "Search Flights"}
          </button>
        </form>
      )}

      {!loadingFlights &&
        searchedFlights &&
        departures.length === 0 &&
        arrivals.length === 0 && <p>No flights found.</p>}

      {departures.length > 0 && (
        <div>
          <h2>Departures</h2>
          <ul>
            {departures.map((f) => {
              const { date, time } = formatDateTime(f.departureDateTime);
              return (
                <li key={f.flightNumber}>
                  <strong>{f.flightNumber}</strong>: {f.originSpaceportName} (
                  {f.originPlanetName}) → {f.destinationSpaceportName} (
                  {f.destinationPlanetName}) using {f.spacecraftType} on {date}{" "}
                  at {time}, distance {f.routeDistance}, craft{" "}
                  {f.spacecraftType} (cap: {f.spacecraftCapacity}, range:{" "}
                  {f.spacecraftRange}), Flight Time: {f.flightTime} hrs
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {arrivals.length > 0 && (
        <div>
          <h2>Arrivals</h2>
          <ul>
            {arrivals.map((f) => {
              const { date, time } = formatDateTime(f.departureDateTime);
              return (
                <li key={f.flightNumber}>
                  <strong>{f.flightNumber}</strong>: {f.originSpaceportName} (
                  {f.originPlanetName}) → {f.destinationSpaceportName} (
                  {f.destinationPlanetName}) arriving on {date} at {time},
                  distance {f.routeDistance}, craft {f.spacecraftType} (cap:{" "}
                  {f.spacecraftCapacity}, range: {f.spacecraftRange}), Flight
                  Time: {f.flightTime} hrs
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SpaceportQuery;
