package com.example.stbackend.Service;

import com.example.stbackend.Model.Planet;
import com.example.stbackend.Repository.PlanetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanetService {

    private final PlanetRepository planetRepository;

    public PlanetService(PlanetRepository planetRepository) {
        this.planetRepository = planetRepository;
    }

    public List<Planet> getAllPlanets() {
        return planetRepository.findAll();
    }

    public Planet savePlanet(Planet planet) {
        if (planetRepository.existsById(planet.getName())) {
            throw new IllegalArgumentException("Planet already exists with name: " + planet.getName());
        }
        return planetRepository.save(planet);
    }
}
