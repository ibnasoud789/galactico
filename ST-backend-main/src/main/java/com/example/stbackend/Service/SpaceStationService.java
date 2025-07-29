package com.example.stbackend.Service;

import com.example.stbackend.Model.SpaceStation;
import com.example.stbackend.Repository.SpaceStationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceStationService {

    private final SpaceStationRepository repository;

    public SpaceStationService(SpaceStationRepository repository) {
        this.repository = repository;
    }

    public List<SpaceStation> getAllStations() {
        return repository.findAll();
    }

    public SpaceStation save(SpaceStation station) {
        if (repository.existsById(station.getName())) {
            throw new IllegalArgumentException("Station already exists with name: " + station.getName());
        }
        return repository.save(station);
    }
}
