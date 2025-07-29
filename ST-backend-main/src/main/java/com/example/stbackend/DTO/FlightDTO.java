package com.example.stbackend.DTO;

import com.example.stbackend.Model.DayOfWeekEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightDTO {
    private String flightNumber;
    private String originSpaceportName;
    private String originPlanetName;
    private String destinationSpaceportName;
    private String destinationPlanetName;
    private String spacecraftType;
    private DayOfWeekEnum dayOfWeek;      // 👈 enum instead of String
    private LocalTime departureTime;
    private double flightTime;            // 👈 double instead of BigDecimal
    private int spacecraftCapacity;
    private int spacecraftRange;
    private int routeDistance;
}
