package com.example.stbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class FlightDetailsDTO {
    private String flightNumber;
    private String originSpaceportName;
    private String originPlanetName;
    private String destinationSpaceportName;
    private String destinationPlanetName;
    private String spacecraftType;
    private LocalDateTime departureDateTime;
    private int routeDistance;
    private int spacecraftCapacity;
    private int spacecraftRange;
}
