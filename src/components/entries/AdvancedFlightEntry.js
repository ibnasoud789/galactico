import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdvancedFlightEntry() {
  const [step, setStep] = useState(1);
  const [ports, setPorts] = useState([]);
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [dist, setDist] = useState("");
  const [needDist, setNeedDist] = useState(false);
  const [crafts, setCrafts] = useState([]);
  const [craft, setCraft] = useState("");
  const [fee, setFee] = useState(null);
  const [details, setDetails] = useState({
    num: "",
    day: "",
    time: "",
    dur: "",
  });
  const [msg, setMsg] = useState({ text: "", type: "" });

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
      .then((res) =>
        setPorts(
          res.data.filter((sp) => sp.name && sp.planet && sp.planet.name)
        )
      )
      .catch(() => {});
  }, []);

  const reset = () => {
    setStep(1);
    setOrigin("");
    setDest("");
    setDist("");
    setNeedDist(false);
    setCrafts([]);
    setCraft("");
    setFee(null);
    setDetails({ num: "", day: "", time: "", dur: "" });
    setMsg({ text: "", type: "" });
  };

  const handleNext = async () => {
    setMsg({ text: "", type: "" });

    // Step 1: select or supply distance for new route
    if (step === 1) {
      if (!origin || !dest) {
        setMsg({
          text: "Please select both origin and destination.",
          type: "error",
        });
        return;
      }
      const [origName, origPlanet] = origin.split("|");
      const [destName, destPlanet] = dest.split("|");
      if (origin === dest) {
        setMsg({
          text: "Origin and destination cannot be the same port.",
          type: "error",
        });
        return;
      }
      if (origPlanet === destPlanet) {
        setMsg({
          text: "Origin and destination must be on different planets.",
          type: "error",
        });
        return;
      }

      if (!needDist) {
        try {
          const r = await axios.get("http://localhost:8080/api/routes/get", {
            params: {
              originSpaceportName: origName,
              originPlanetName: origPlanet,
              destinationSpaceportName: destName,
              destinationPlanetName: destPlanet,
            },
          });
          setDist(String(r.data.distance));
          // fetch crafts for existing route
          const cs = await axios.get(
            "http://localhost:8080/api/flights/available-spacecraft",
            {
              params: { distance: r.data.distance },
            }
          );
          setCrafts(cs.data);
          setStep(2);
        } catch {
          // route not found, ask distance but do NOT create yet
          setNeedDist(true);
          setMsg({
            text: "Route not found. Please enter distance to proceed.",
            type: "error",
          });
        }
        return;
      }

      // user supplies distance for new route
      if (!dist || isNaN(dist) || parseFloat(dist) <= 0) {
        setMsg({
          text: "Please enter a positive numeric distance.",
          type: "error",
        });
        return;
      }
      // fetch crafts based on distance without creating route
      try {
        const cs2 = await axios.get(
          "http://localhost:8080/api/flights/available-spacecraft",
          {
            params: { distance: parseFloat(dist) },
          }
        );
        setCrafts(cs2.data);
        setStep(2);
      } catch {
        setMsg({ text: "Failed to fetch spacecrafts.", type: "error" });
      }
      return;
    }

    // Step 2: spacecraft selection
    if (step === 2) {
      if (!craft) {
        setMsg({ text: "Please select a spacecraft.", type: "error" });
        return;
      }
      try {
        const f = await axios.get(
          "http://localhost:8080/api/flights/calculate-fee",
          {
            params: {
              originSpaceportName: origin.split("|")[0],
              originPlanetName: origin.split("|")[1],
              destinationSpaceportName: dest.split("|")[0],
              destinationPlanetName: dest.split("|")[1],
              spacecraftType: craft,
            },
          }
        );
        setFee(f.data);
        setStep(3);
      } catch {
        setMsg({ text: "Failed to calculate fee.", type: "error" });
      }
      return;
    }

    // Step 3: flight details entry
    if (step === 3) {
      const { num, day, time, dur } = details;
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (
        !num.trim() ||
        !day ||
        !timePattern.test(time) ||
        isNaN(dur) ||
        parseFloat(dur) <= 0
      ) {
        setMsg({
          text: "Fill out flight #, day, HH:mm departure, positive duration.",
          type: "error",
        });
        return;
      }
      setStep(4);
      return;
    }
  };

  const handleConfirm = async () => {
    setMsg({ text: "", type: "" });
    // first, create route if needed
    if (needDist) {
      try {
        await axios.post("http://localhost:8080/api/routes", {
          originSpaceportName: origin.split("|")[0],
          originPlanetName: origin.split("|")[1],
          destinationSpaceportName: dest.split("|")[0],
          destinationPlanetName: dest.split("|")[1],
          distance: parseFloat(dist),
        });
      } catch {
        setMsg({ text: "Failed to create route.", type: "error" });
        return;
      }
    }

    // then create flight
    try {
      await axios.post("http://localhost:8080/api/flights", {
        flightNumber: details.num.trim(),
        originSpaceportName: origin.split("|")[0],
        originPlanetName: origin.split("|")[1],
        destinationSpaceportName: dest.split("|")[0],
        destinationPlanetName: dest.split("|")[1],
        spacecraftType: craft,
        dayOfWeek: details.day,
        departureTime: details.time.trim(),
        flightTime: parseFloat(details.dur),
      });
      setMsg({ text: "Flight created successfully!", type: "success" });
      reset();
    } catch {
      setMsg({ text: "Flight creation failed.", type: "error" });
    }
  };

  return (
    <div>
      <h2>Advanced Flight Entry</h2>
      {msg.text && (
        <p style={{ color: msg.type === "success" ? "green" : "red" }}>
          {msg.text}
        </p>
      )}

      {step === 1 && (
        <div>
          <h3>Step 1: Select Route</h3>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option value="">-- Select Origin --</option>
            {ports.map((p) => (
              <option
                key={`${p.name}|${p.planet.name}`}
                value={`${p.name}|${p.planet.name}`}
              >
                {p.name} ({p.planet.name})
              </option>
            ))}
          </select>
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">-- Select Destination --</option>
            {ports.map((p) => (
              <option
                key={`${p.name}|${p.planet.name}`}
                value={`${p.name}|${p.planet.name}`}
              >
                {p.name} ({p.planet.name})
              </option>
            ))}
          </select>
          {needDist && (
            <input
              placeholder="Distance (new route)"
              value={dist}
              onChange={(e) => setDist(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          )}
          <div style={{ marginTop: 12 }}>
            <button onClick={handleNext}>Next</button>
            <button onClick={reset} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Step 2: Select Spacecraft</h3>
          <select value={craft} onChange={(e) => setCraft(e.target.value)}>
            <option value="">-- Select Spacecraft --</option>
            {crafts.map((c) => (
              <option key={c.typeName} value={c.typeName}>
                {c.typeName}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleNext}>Next</button>
            <button onClick={reset} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Step 3: Enter Flight Info</h3>
          <p>Total Fee: {fee !== null ? `$${fee}` : "..."}</p>
          <input
            placeholder="Flight Number"
            value={details.num}
            onChange={(e) =>
              setDetails((prev) => ({ ...prev, num: e.target.value }))
            }
            style={{ display: "block", marginBottom: 8 }}
          />
          <select
            value={details.day}
            onChange={(e) =>
              setDetails((prev) => ({ ...prev, day: e.target.value }))
            }
            style={{ display: "block", marginBottom: 8 }}
          >
            <option value="">-- Select Day --</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            placeholder="Departure Time (HH:mm)"
            value={details.time}
            onChange={(e) =>
              setDetails((prev) => ({ ...prev, time: e.target.value }))
            }
            style={{ display: "block", marginBottom: 8 }}
          />
          <input
            placeholder="Flight Duration (hrs)"
            value={details.dur}
            onChange={(e) =>
              setDetails((prev) => ({ ...prev, dur: e.target.value }))
            }
            style={{ display: "block", marginBottom: 8 }}
          />
          <div>
            <button onClick={handleNext}>Next</button>
            <button onClick={reset} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3>Step 4: Confirm and Submit</h3>
          <p>
            <strong>From:</strong> {origin.replace("|", " (")} )
          </p>
          <p>
            <strong>To:</strong> {dest.replace("|", " (")} )
          </p>
          <p>
            <strong>Spacecraft:</strong> {craft}
          </p>
          <p>
            <strong>Day:</strong> {details.day}
          </p>
          <p>
            <strong>Departure:</strong> {details.time}
          </p>
          <p>
            <strong>Duration:</strong> {details.dur} hrs
          </p>
          <p>
            <strong>Total Fee:</strong> ${fee}
          </p>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleConfirm}>Confirm Flight</button>
            <button onClick={reset} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
