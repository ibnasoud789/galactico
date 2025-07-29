package com.example.stbackend.Controller;

import com.example.stbackend.DTO.SpaceStationDTO;
import com.example.stbackend.Model.Planet;
import com.example.stbackend.Model.SpaceStation;
import com.example.stbackend.Repository.PlanetRepository;
import com.example.stbackend.Repository.SpaceStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spacestations")
@CrossOrigin(origins = "http://localhost:3000") // If using React dev server
public class SpaceStationController {

    @Autowired
    private SpaceStationRepository spaceStationRepository;

    @Autowired
    private PlanetRepository planetRepository;

    @GetMapping
    public List<SpaceStation> getAllSpaceStations() {
        return spaceStationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addSpaceStation(@RequestBody SpaceStationDTO dto) {
        // Check if station name already exists
        if (spaceStationRepository.existsById(dto.name)) {
            return ResponseEntity.status(409).body("Space station already exists with name: " + dto.name);
        }

        Planet ownedBy = planetRepository.findById(dto.ownedByPlanet).orElse(null);
        if (ownedBy == null) {
            return ResponseEntity.badRequest().body("OwnedByPlanet not found: " + dto.ownedByPlanet);
        }

        Planet inOrbitOf = null;
        if (dto.inOrbitOf != null && !dto.inOrbitOf.isEmpty()) {
            inOrbitOf = planetRepository.findById(dto.inOrbitOf).orElse(null);
            if (inOrbitOf == null) {
                return ResponseEntity.badRequest().body("InOrbitOf not found: " + dto.inOrbitOf);
            }

            if (!inOrbitOf.getName().equals(ownedBy.getName())) {
                return ResponseEntity.badRequest().body("InOrbitOf planet must match OwnedByPlanet.");
            }
        }

        SpaceStation station = new SpaceStation();
        station.setName(dto.name);
        station.setInOrbitOf(inOrbitOf);
        station.setOwnedByPlanet(ownedBy);

        return ResponseEntity.ok(spaceStationRepository.save(station));
    }
}
