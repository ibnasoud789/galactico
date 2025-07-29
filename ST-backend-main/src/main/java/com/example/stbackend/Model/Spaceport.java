package com.example.stbackend.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@IdClass(SpaceportId.class)
public class Spaceport {

    @Id
    private String name;

    @Id
    @ManyToOne
    @JoinColumn(name = "planetName", referencedColumnName = "name")
    private Planet planet;

    @ManyToOne
    @JoinColumn(name = "stationName", referencedColumnName = "name")
    private SpaceStation station;

    private int capacity;

    private BigDecimal feePerSeat;

    public Spaceport() {}

    // --- Getters and Setters ---

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Planet getPlanet() {
        return planet;
    }

    public void setPlanet(Planet planet) {
        this.planet = planet;
    }

    public SpaceStation getStation() {
        return station;
    }

    public void setStation(SpaceStation station) {
        this.station = station;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getFeePerSeat() {
        return feePerSeat;
    }

    public void setFeePerSeat(BigDecimal feePerSeat) {
        this.feePerSeat = feePerSeat;
    }
}
