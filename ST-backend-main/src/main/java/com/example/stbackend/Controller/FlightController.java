package com.example.stbackend.Controller;

import com.example.stbackend.DTO.FlightDTO;
import com.example.stbackend.Model.Flight;
import com.example.stbackend.Model.Spacecraft;
import com.example.stbackend.Model.DayOfWeekEnum;
import com.example.stbackend.Service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping("")
    public Flight addFlight(@RequestBody Flight flight) {
        try {
            return flightService.saveFlight(flight);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/get/{flightNumber}")
    public Flight getFlight(@PathVariable String flightNumber) {
        return flightService.getById(flightNumber);
    }

    @GetMapping("/route")
    public List<FlightDTO> getFlightsByRoute(
            @RequestParam String originSpaceportName,
            @RequestParam String originPlanetName,
            @RequestParam String destinationSpaceportName,
            @RequestParam String destinationPlanetName) {
        return flightService.getFlightsByRoute(
                originSpaceportName,
                originPlanetName,
                destinationSpaceportName,
                destinationPlanetName
        );
    }

    @GetMapping("/available-spacecraft")
    public List<Spacecraft> getAvailableSpacecraft(@RequestParam int distance) {
        return flightService.getAvailableSpacecrafts(distance);
    }

    @GetMapping("/calculate-fee")
    public BigDecimal getTotalFee(@RequestParam String originSpaceportName,
                                  @RequestParam String originPlanetName,
                                  @RequestParam String destinationSpaceportName,
                                  @RequestParam String destinationPlanetName,
                                  @RequestParam String spacecraftType) {
        return flightService.calculateFee(
                originSpaceportName,
                originPlanetName,
                destinationSpaceportName,
                destinationPlanetName,
                spacecraftType
        );
    }

    @GetMapping("/itineraries")
    public List<List<Flight>> findItineraries(
            @RequestParam String originSpaceportName,
            @RequestParam String originPlanetName,
            @RequestParam String destSpaceportName,
            @RequestParam String destPlanetName,
            @RequestParam DayOfWeekEnum dayOfWeek,
            @RequestParam String startTime,
            @RequestParam int maxStops,
            @RequestParam double maxTotalHours
    ) {
        LocalTime time = LocalTime.parse(startTime);
        return flightService.findItineraries(
                originSpaceportName,
                originPlanetName,
                destSpaceportName,
                destPlanetName,
                dayOfWeek,
                time,
                maxStops,
                maxTotalHours
        );
    }
}
