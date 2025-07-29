package com.example.stbackend.Service;

import com.example.stbackend.DTO.FlightDTO;
import com.example.stbackend.Model.Flight;
import com.example.stbackend.Model.Route;
import com.example.stbackend.Model.RouteId;
import com.example.stbackend.Model.Spacecraft;
import com.example.stbackend.Model.Spaceport;
import com.example.stbackend.Model.SpaceportId;
import com.example.stbackend.Model.DayOfWeekEnum;
import com.example.stbackend.Repository.FlightRepository;
import com.example.stbackend.Repository.RouteRepository;
import com.example.stbackend.Repository.SpacecraftRepository;
import com.example.stbackend.Repository.SpaceportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private SpacecraftRepository spacecraftRepository;

    @Autowired
    private SpaceportRepository spaceportRepository;

    public Flight saveFlight(Flight flight) {
        if (flightRepository.existsById(flight.getFlightNumber())) {
            throw new IllegalArgumentException("Flight with this flight number already exists.");
        }

        // 1. Check if route exists
        RouteId routeId = new RouteId(
                flight.getOriginSpaceportName(),
                flight.getOriginPlanetName(),
                flight.getDestinationSpaceportName(),
                flight.getDestinationPlanetName()
        );
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found."));

        // 2. Check spacecraft and range
        Spacecraft sc = spacecraftRepository.findById(flight.getSpacecraftType())
                .orElseThrow(() -> new IllegalArgumentException("Spacecraft not found."));
        if (sc.getCraftRange() < route.getDistance()) {
            throw new IllegalArgumentException("Spacecraft range is insufficient for this route.");
        }

        // 3. Capacity checks
        long departures = flightRepository.countByOriginSpaceportAndDay(
                flight.getOriginSpaceportName(),
                flight.getOriginPlanetName(),
                flight.getDayOfWeek()
        );
        long arrivals = flightRepository.countByDestinationSpaceportAndDay(
                flight.getDestinationSpaceportName(),
                flight.getDestinationPlanetName(),
                flight.getDayOfWeek()
        );

        Spaceport origin = spaceportRepository.findById(
                new SpaceportId(flight.getOriginSpaceportName(), flight.getOriginPlanetName())
        ).orElseThrow(() -> new IllegalArgumentException("Origin spaceport not found."));
        Spaceport destination = spaceportRepository.findById(
                new SpaceportId(flight.getDestinationSpaceportName(), flight.getDestinationPlanetName())
        ).orElseThrow(() -> new IllegalArgumentException("Destination spaceport not found."));

        if (departures >= origin.getCapacity()) {
            throw new IllegalArgumentException("Origin spaceport has reached its max daily flight capacity.");
        }
        if (arrivals >= destination.getCapacity()) {
            throw new IllegalArgumentException("Destination spaceport has reached its max daily flight capacity.");
        }

        return flightRepository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getById(String flightNumber) {
        return flightRepository.findById(flightNumber).orElse(null);
    }

    public List<FlightDTO> getFlightsByRoute(String originSpaceportName, String originPlanetName,
                                             String destinationSpaceportName, String destinationPlanetName) {
        return flightRepository.findFlightsByRoute(
                originSpaceportName,
                originPlanetName,
                destinationSpaceportName,
                destinationPlanetName
        );
    }

    public List<Spacecraft> getAvailableSpacecrafts(int distance) {
        return spacecraftRepository.findByCraftRangeGreaterThanEqual(distance);
    }

    public BigDecimal calculateFee(
            String originSpaceportName,
            String originPlanetName,
            String destinationSpaceportName,
            String destinationPlanetName,
            String spacecraftType
    ) {
        Spaceport origin = spaceportRepository.findById(
                new SpaceportId(originSpaceportName, originPlanetName)
        ).orElseThrow(() -> new IllegalArgumentException("Origin spaceport not found."));
        Spaceport destination = spaceportRepository.findById(
                new SpaceportId(destinationSpaceportName, destinationPlanetName)
        ).orElseThrow(() -> new IllegalArgumentException("Destination spaceport not found."));

        Spacecraft spacecraft = spacecraftRepository.findById(spacecraftType)
                .orElseThrow(() -> new IllegalArgumentException("Spacecraft not found."));

        BigDecimal feePerSeat = origin.getFeePerSeat().add(destination.getFeePerSeat());
        return feePerSeat.multiply(BigDecimal.valueOf(spacecraft.getCapacity()));
    }

    /**
     * Finds itineraries from origin to destination on the given day and start time.
     * Applies maxStops, maxTotalHours, 3h window for first leg, 1-6h layover.
     */
    public List<List<Flight>> findItineraries(
            String originSpaceportName,
            String originPlanetName,
            String destSpaceportName,
            String destPlanetName,
            DayOfWeekEnum dayOfWeek,
            LocalTime startTime,
            int maxStops,
            double maxTotalHours
    ) {
        List<List<Flight>> results = new ArrayList<>();
        Deque<List<Flight>> queue = new ArrayDeque<>();

        LocalTime windowEnd = startTime.plusHours(3);
        List<Flight> initialFlights = flightRepository
                .findByOriginSpaceportNameAndOriginPlanetNameAndDayOfWeekAndDepartureTimeBetween(
                        originSpaceportName,
                        originPlanetName,
                        dayOfWeek,
                        startTime,
                        windowEnd
                );
        for (Flight f : initialFlights) {
            List<Flight> path = new ArrayList<>();
            path.add(f);
            queue.add(path);
        }

        while (!queue.isEmpty()) {
            List<Flight> path = queue.poll();
            Flight last = path.get(path.size() - 1);

            double hours = last.getFlightTime();
            long minutesTravel = (long) (hours * 60);
            LocalTime arrivalTime = last.getDepartureTime().plusMinutes(minutesTravel);

            long totalMinutes = Duration.between(path.get(0).getDepartureTime(), arrivalTime).toMinutes();
            double totalHours = totalMinutes / 60.0;

            if (last.getDestinationSpaceportName().equals(destSpaceportName) &&
                    last.getDestinationPlanetName().equals(destPlanetName)) {
                if (path.size() - 1 <= maxStops && totalHours <= maxTotalHours) {
                    results.add(path);
                }
                continue;
            }

            if (path.size() > maxStops + 1 || totalHours > maxTotalHours) {
                continue;
            }

            LocalTime earliestNext = arrivalTime.plusHours(1);
            LocalTime latestNext = arrivalTime.plusHours(6);
            List<Flight> nextLegs = flightRepository
                    .findByOriginSpaceportNameAndOriginPlanetNameAndDayOfWeekAndDepartureTimeBetween(
                            last.getDestinationSpaceportName(),
                            last.getDestinationPlanetName(),
                            dayOfWeek,
                            earliestNext,
                            latestNext
                    );
            for (Flight next : nextLegs) {
                boolean visited = path.stream()
                        .anyMatch(f -> f.getFlightNumber().equals(next.getFlightNumber()));
                if (visited) continue;
                List<Flight> newPath = new ArrayList<>(path);
                newPath.add(next);
                queue.add(newPath);
            }
        }

        return results;
    }
}
