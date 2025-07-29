package com.example.stbackend.Controller;

import com.example.stbackend.Model.Route;
import com.example.stbackend.Model.RouteId;
import com.example.stbackend.Service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("")
    public Route addRoute(@RequestBody Route route) {
        try {
            return routeService.saveRoute(route);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }


    @GetMapping("")
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/get")
    public Route getRoute(@RequestParam String originSpaceportName,
                          @RequestParam String originPlanetName,
                          @RequestParam String destinationSpaceportName,
                          @RequestParam String destinationPlanetName) {

        RouteId routeId = new RouteId(
                originSpaceportName,
                originPlanetName,
                destinationSpaceportName,
                destinationPlanetName
        );

        return routeService.getRouteById(routeId);
    }
}
