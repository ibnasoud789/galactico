package com.example.stbackend.Controller;

import com.example.stbackend.Model.Planet;
import com.example.stbackend.Service.PlanetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planets")
public class PlanetController {

    private final PlanetService planetService;

    public PlanetController(PlanetService planetService) {
        this.planetService = planetService;
    }

    @GetMapping
    public List<Planet> getAllPlanets() {
        return planetService.getAllPlanets().stream()
                .filter(p -> !"n/a".equalsIgnoreCase(p.getName()))
                .toList();
    }

    @PostMapping
    public Planet createPlanet(@RequestBody Planet planet) {
        return planetService.savePlanet(planet);
    }
}
