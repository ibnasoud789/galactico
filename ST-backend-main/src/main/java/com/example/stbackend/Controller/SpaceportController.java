package com.example.stbackend.Controller;

import com.example.stbackend.Model.Spaceport;
import com.example.stbackend.DTO.SpaceportTrafficDTO;
import com.example.stbackend.Service.SpaceportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/spaceports")
@CrossOrigin(origins = "http://localhost:3000")
public class SpaceportController {

    private final SpaceportService service;

    public SpaceportController(SpaceportService service) {
        this.service = service;
    }

    // existing endpoints -----------------------------

    @GetMapping
    public List<Spaceport> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Spaceport create(@RequestBody Spaceport port) {
        return service.save(port);
    }

    // new traffic endpoint --------------------------

    @GetMapping("/traffic")
    public SpaceportTrafficDTO traffic(
            @RequestParam String spaceportName,
            @RequestParam String planetName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return service.getTraffic(spaceportName, planetName, startDate, endDate);
    }
}
