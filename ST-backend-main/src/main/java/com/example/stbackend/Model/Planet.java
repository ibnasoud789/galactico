package com.example.stbackend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Planet {

    @Id
    private String name;

    private int size;
    private long population;

    public Planet() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public long getPopulation() {
        return population;
    }

    public void setPopulation(long population) {
        this.population = population;
    }
}
