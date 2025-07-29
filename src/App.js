import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home";

import PlanetEntry from "./components/entries/PlanetEntry";
import SpaceStationEntry from "./components/entries/SpaceStationEntry";
import PlanetSpaceportEntry from "./components/entries/PlanetSpaceportEntry";
import StationSpaceportEntry from "./components/entries/StationSpaceportEntry";
import RouteEntry from "./components/entries/RouteEntry";
import SpacecraftEntry from "./components/entries/SpacecraftEntry";
import FlightEntry from "./components/entries/FlightEntry";
import AdvancedFlightEntry from "./components/entries/AdvancedFlightEntry";

import SpaceportQuery from "./components/queries/SpaceportQuery";
import RouteQuery from "./components/queries/RouteQuery";
import FlightFinder from "./components/queries/FlightFinder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        {/* Data Entry */}
        <Route path="/planet-entry" element={<PlanetEntry />} />
        <Route path="/space-station-entry" element={<SpaceStationEntry />} />
        <Route
          path="/planet-spaceport-entry"
          element={<PlanetSpaceportEntry />}
        />
        <Route
          path="/station-spaceport-entry"
          element={<StationSpaceportEntry />}
        />
        <Route path="/route-entry" element={<RouteEntry />} />
        <Route path="/spacecraft-entry" element={<SpacecraftEntry />} />
        <Route path="/flight-entry" element={<FlightEntry />} />
        <Route
          path="/advanced-flight-entry"
          element={<AdvancedFlightEntry />}
        />

        {/* Queries */}
        <Route path="/spaceport-query" element={<SpaceportQuery />} />
        <Route path="/route-query" element={<RouteQuery />} />
        <Route path="/flight-finder" element={<FlightFinder />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
