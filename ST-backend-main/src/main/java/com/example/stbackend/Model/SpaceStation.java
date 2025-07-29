package com.example.stbackend.Model;

import jakarta.persistence.*;

@Entity
public class SpaceStation {

    @Id
    private String name;

    @ManyToOne
    @JoinColumn(name = "inOrbitOf")
    private Planet inOrbitOf; // Nullable

    @ManyToOne(optional = false)
    @JoinColumn(name = "ownedByPlanet", nullable = false)
    private Planet ownedByPlanet;

    public SpaceStation() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Planet getInOrbitOf() {
        return inOrbitOf;
    }

    public void setInOrbitOf(Planet inOrbitOf) {
        this.inOrbitOf = inOrbitOf;
    }

    public Planet getOwnedByPlanet() {
        return ownedByPlanet;
    }

    public void setOwnedByPlanet(Planet ownedByPlanet) {
        this.ownedByPlanet = ownedByPlanet;
    }
}
