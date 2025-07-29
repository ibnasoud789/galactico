package com.example.stbackend.Service;

import com.example.stbackend.DTO.SpaceportDTO;
import com.example.stbackend.DTO.SpaceportTrafficDTO;
import com.example.stbackend.DTO.FlightDetailsDTO;
import com.example.stbackend.Model.Flight;
import com.example.stbackend.Model.Route;
import com.example.stbackend.Model.RouteId;
import com.example.stbackend.Model.Spacecraft;
import com.example.stbackend.Model.Spaceport;
import com.example.stbackend.Model.DayOfWeekEnum;
import com.example.stbackend.Repository.FlightRepository;
import com.example.stbackend.Repository.RouteRepository;
import com.example.stbackend.Repository.SpacecraftRepository;
import com.example.stbackend.Repository.SpaceportRepository;
import com.example.stbackend.Repository.PlanetRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SpaceportService {

    private final FlightRepository flightRepo;
    private final RouteRepository routeRepo;
    private final SpacecraftRepository craftRepo;
    private final SpaceportRepository spaceportRepo;
    private final PlanetRepository planetRepo;

    @Autowired
    public SpaceportService(FlightRepository flightRepo,
                            RouteRepository routeRepo,
                            SpacecraftRepository craftRepo,
                            SpaceportRepository spaceportRepo,
                            PlanetRepository planetRepo) {
        this.flightRepo    = flightRepo;
        this.routeRepo     = routeRepo;
        this.craftRepo     = craftRepo;
        this.spaceportRepo = spaceportRepo;
        this.planetRepo    = planetRepo;
    }

    // existing methods
    public List<Spaceport> getAll() {
        return spaceportRepo.findAll();
    }

    public Spaceport save(Spaceport port) {
        boolean hasStation = port.getStation() != null;
        boolean isPlanetNA  = port.getPlanet() != null
                              && "n/a".equalsIgnoreCase(port.getPlanet().getName());

        if (hasStation && !isPlanetNA) {
            throw new IllegalArgumentException(
                    "If station is provided, planet.name must be 'n/a'"
            );
        }

        if (port.getPlanet() != null) {
            String name = port.getPlanet().getName();
            var resolved = planetRepo.findById(name)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Planet not found: " + name
                    ));
            port.setPlanet(resolved);
        }

        return spaceportRepo.save(port);
    }

    // new traffic feature
    public SpaceportTrafficDTO getTraffic(String port,
                                          String planet,
                                          LocalDate start,
                                          LocalDate end) {
        // connected spaceports
        var origins = flightRepo.findOriginsTo(port, planet);
        var dests   = flightRepo.findDestinationsFrom(port, planet);
        List<SpaceportDTO> connected = new ArrayList<>();
        connected.addAll(origins);
        connected.addAll(dests);

        // valid days-of-week
        Set<DayOfWeekEnum> validDays = start
                .datesUntil(end.plusDays(1))
                .map(LocalDate::getDayOfWeek)
                .map(d -> DayOfWeekEnum.valueOf(
                        d.name().charAt(0) + d.name().substring(1).toLowerCase()
                ))
                .collect(Collectors.toSet());

        // departures: one per week in range
        var deps = flightRepo
                .findByOriginSpaceportNameAndOriginPlanetName(port, planet)
                .stream()
                .filter(f -> validDays.contains(f.getDayOfWeek()))
                .flatMap(f -> {
                    DayOfWeek dow = DayOfWeek.valueOf(f.getDayOfWeek().name().toUpperCase());
                    LocalDate date = start.with(TemporalAdjusters.nextOrSame(dow));
                    List<FlightDetailsDTO> list = new ArrayList<>();
                    while (!date.isAfter(end)) {
                        list.add(toDetails(f, date));
                        date = date.plusWeeks(1);
                    }
                    return list.stream();
                })
                .sorted(Comparator.comparing(FlightDetailsDTO::getDepartureDateTime))
                .toList();

        // arrivals: one per week in range
        var arrs = flightRepo
                .findByDestinationSpaceportNameAndDestinationPlanetName(port, planet)
                .stream()
                .filter(f -> validDays.contains(f.getDayOfWeek()))
                .flatMap(f -> {
                    DayOfWeek dow = DayOfWeek.valueOf(f.getDayOfWeek().name().toUpperCase());
                    LocalDate date = start.with(TemporalAdjusters.nextOrSame(dow));
                    List<FlightDetailsDTO> list = new ArrayList<>();
                    while (!date.isAfter(end)) {
                        list.add(toDetails(f, date));
                        date = date.plusWeeks(1);
                    }
                    return list.stream();
                })
                .sorted(Comparator.comparing(FlightDetailsDTO::getDepartureDateTime))
                .toList();

        return SpaceportTrafficDTO.builder()
                .connectedSpaceports(connected)
                .departures(deps)
                .arrivals(arrs)
                .build();
    }

    private FlightDetailsDTO toDetails(Flight f, LocalDate date) {
        LocalDateTime dt = LocalDateTime.of(date, f.getDepartureTime());
        var id = new RouteId(
                f.getOriginSpaceportName(), f.getOriginPlanetName(),
                f.getDestinationSpaceportName(), f.getDestinationPlanetName()
        );
        Route r = routeRepo.findById(id).orElseThrow();
        Spacecraft c = craftRepo.findById(f.getSpacecraftType()).orElseThrow();

        return FlightDetailsDTO.builder()
                .flightNumber(f.getFlightNumber())
                .departureDateTime(dt)
                .originSpaceportName(f.getOriginSpaceportName())
                .originPlanetName(f.getOriginPlanetName())
                .destinationSpaceportName(f.getDestinationSpaceportName())
                .destinationPlanetName(f.getDestinationPlanetName())
                .routeDistance(r.getDistance())
                .spacecraftType(c.getTypeName())
                .spacecraftCapacity(c.getCapacity())
                .spacecraftRange(c.getCraftRange())
                .build();
    }
}
