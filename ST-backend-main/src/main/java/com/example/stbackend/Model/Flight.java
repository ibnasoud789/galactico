package com.example.stbackend.Model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Flight")
public class Flight {

    @Id
    private String flightNumber;

    private String originSpaceportName;
    private String originPlanetName;

    private String destinationSpaceportName;
    private String destinationPlanetName;

    private String spacecraftType;

    @Enumerated(EnumType.STRING)
    private DayOfWeekEnum dayOfWeek;

    private LocalTime departureTime;

    private double flightTime;

    public Flight() {}

    public Flight(String flightNumber, String originSpaceportName, String originPlanetName,
                  String destinationSpaceportName, String destinationPlanetName,
                  String spacecraftType, DayOfWeekEnum dayOfWeek,
                  LocalTime departureTime, double flightTime) {
        this.flightNumber = flightNumber;
        this.originSpaceportName = originSpaceportName;
        this.originPlanetName = originPlanetName;
        this.destinationSpaceportName = destinationSpaceportName;
        this.destinationPlanetName = destinationPlanetName;
        this.spacecraftType = spacecraftType;
        this.dayOfWeek = dayOfWeek;
        this.departureTime = departureTime;
        this.flightTime = flightTime;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getOriginSpaceportName() {
        return originSpaceportName;
    }

    public void setOriginSpaceportName(String originSpaceportName) {
        this.originSpaceportName = originSpaceportName;
    }

    public String getOriginPlanetName() {
        return originPlanetName;
    }

    public void setOriginPlanetName(String originPlanetName) {
        this.originPlanetName = originPlanetName;
    }

    public String getDestinationSpaceportName() {
        return destinationSpaceportName;
    }

    public void setDestinationSpaceportName(String destinationSpaceportName) {
        this.destinationSpaceportName = destinationSpaceportName;
    }

    public String getDestinationPlanetName() {
        return destinationPlanetName;
    }

    public void setDestinationPlanetName(String destinationPlanetName) {
        this.destinationPlanetName = destinationPlanetName;
    }

    public String getSpacecraftType() {
        return spacecraftType;
    }

    public void setSpacecraftType(String spacecraftType) {
        this.spacecraftType = spacecraftType;
    }

    public DayOfWeekEnum getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeekEnum dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public double getFlightTime() {
        return flightTime;
    }

    public void setFlightTime(double flightTime) {
        this.flightTime = flightTime;
    }
}
