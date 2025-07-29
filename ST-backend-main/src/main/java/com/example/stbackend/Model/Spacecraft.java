package com.example.stbackend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "Spacecraft")
public class Spacecraft {

    @Id
    private String typeName;

    private int capacity;

    private int craftRange;

    public Spacecraft() {}

    public Spacecraft(String typeName, int capacity, int craftRange) {
        this.typeName = typeName;
        this.capacity = capacity;
        this.craftRange = craftRange;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getCraftRange() {
        return craftRange;
    }

    public void setCraftRange(int craftRange) {
        this.craftRange = craftRange;
    }
}
