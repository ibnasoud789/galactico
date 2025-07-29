import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Inter-Galactic Travel Dashboard</h1>

        <h2>🚀 Data Entry</h2>
        <ul>
          <li>
            <Link to="/planet-entry">Planet Entry</Link>
          </li>
          <li>
            <Link to="/space-station-entry">Space Station Entry</Link>
          </li>
          <li>
            <Link to="/planet-spaceport-entry">Planet Spaceport Entry</Link>
          </li>
          <li>
            <Link to="/station-spaceport-entry">Station Spaceport Entry</Link>
          </li>
          <li>
            <Link to="/route-entry">Route Entry</Link>
          </li>
          <li>
            <Link to="/spacecraft-entry">Spacecraft Entry</Link>
          </li>
          <li>
            <Link to="/flight-entry">Flight Entry</Link>
          </li>
          <li>
            <Link to="/advanced-flight-entry">Advanced Flight Entry</Link>
          </li>
        </ul>

        <h2>🔍 Queries</h2>
        <ul>
          <li>
            <Link to="/spaceport-query">Spaceport Query</Link>
          </li>
          <li>
            <Link to="/route-query">Route Query</Link>
          </li>
          <li>
            <Link to="/flight-finder">Flight Finder</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
