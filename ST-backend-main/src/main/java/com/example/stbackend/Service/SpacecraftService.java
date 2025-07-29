package com.example.stbackend.Service;

import com.example.stbackend.Model.Spacecraft;
import com.example.stbackend.Repository.SpacecraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpacecraftService {

    @Autowired
    private SpacecraftRepository spacecraftRepository;

    public Spacecraft saveSpacecraft(Spacecraft spacecraft) {
        if (spacecraftRepository.existsById(spacecraft.getTypeName())) {
            throw new IllegalArgumentException("Spacecraft with typeName '" +
                    spacecraft.getTypeName() + "' already exists.");
        }
        return spacecraftRepository.save(spacecraft);
    }


    public List<Spacecraft> getAllSpacecraft() {
        return spacecraftRepository.findAll();
    }

    public Spacecraft getById(String typeName) {
        return spacecraftRepository.findById(typeName).orElse(null);
    }
}
