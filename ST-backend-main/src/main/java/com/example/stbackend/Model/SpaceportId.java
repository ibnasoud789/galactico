package com.example.stbackend.Model;

import java.io.Serializable;
import java.util.Objects;

public class SpaceportId implements Serializable {
    private String name;
    private String planet; // references Planet.name

    public SpaceportId() {}

    public SpaceportId(String name, String planet) {
        this.name = name;
        this.planet = planet;
    }

    // equals() and hashCode() are required

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SpaceportId that)) return false;
        return Objects.equals(name, that.name) && Objects.equals(planet, that.planet);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, planet);
    }
}
