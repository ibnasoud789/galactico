package com.example.stbackend.Controller;

import com.example.stbackend.Model.Spacecraft;
import com.example.stbackend.Service.SpacecraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/spacecraft")
public class SpacecraftController {

    private final SpacecraftService spacecraftService;

    @Autowired
    public SpacecraftController(SpacecraftService spacecraftService) {
        this.spacecraftService = spacecraftService;
    }

    @PostMapping("")
    public Spacecraft addSpacecraft(@RequestBody Spacecraft spacecraft) {
        try {
            return spacecraftService.saveSpacecraft(spacecraft);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, e.getMessage(), e
            );
        }
    }


    @GetMapping("")
    public List<Spacecraft> getAllSpacecraft() {
        return spacecraftService.getAllSpacecraft();
    }

    @GetMapping("/get/{typeName}")
    public Spacecraft getSpacecraftById(@PathVariable String typeName) {
        return spacecraftService.getById(typeName);
    }
}
