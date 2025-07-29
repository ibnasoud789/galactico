package com.example.stbackend.Model;

import jakarta.persistence.*;

@Entity
@IdClass(RouteId.class)
@Table(name = "Route")
public class Route {

    @Id
    private String originSpaceportName;

    @Id
    private String originPlanetName;

    @Id
    private String destinationSpaceportName;

    @Id
    private String destinationPlanetName;

    private int distance;

    public Route() {}

    public Route(String originSpaceportName, String originPlanetName,
                 String destinationSpaceportName, String destinationPlanetName,
                 int distance) {
        this.originSpaceportName = originSpaceportName;
        this.originPlanetName = originPlanetName;
        this.destinationSpaceportName = destinationSpaceportName;
        this.destinationPlanetName = destinationPlanetName;
        this.distance = distance;
    }

    // Getters and Setters

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

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }
}
