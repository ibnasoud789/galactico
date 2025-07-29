package com.example.stbackend.Model;

import java.io.Serializable;
import java.util.Objects;

public class RouteId implements Serializable {

    private String originSpaceportName;
    private String originPlanetName;
    private String destinationSpaceportName;
    private String destinationPlanetName;

    public RouteId() {}

    public RouteId(String originSpaceportName, String originPlanetName,
                   String destinationSpaceportName, String destinationPlanetName) {
        this.originSpaceportName = originSpaceportName;
        this.originPlanetName = originPlanetName;
        this.destinationSpaceportName = destinationSpaceportName;
        this.destinationPlanetName = destinationPlanetName;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RouteId)) return false;
        RouteId that = (RouteId) o;
        return Objects.equals(originSpaceportName, that.originSpaceportName) &&
                Objects.equals(originPlanetName, that.originPlanetName) &&
                Objects.equals(destinationSpaceportName, that.destinationSpaceportName) &&
                Objects.equals(destinationPlanetName, that.destinationPlanetName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(originSpaceportName, originPlanetName,
                destinationSpaceportName, destinationPlanetName);
    }
}
