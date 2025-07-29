package com.example.stbackend.Repository;

import com.example.stbackend.Model.Planet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanetRepository extends JpaRepository<Planet, String> {
}
