package com.example.stbackend.Service;

import com.example.stbackend.Model.Route;
import com.example.stbackend.Model.RouteId;
import com.example.stbackend.Repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public Route saveRoute(Route route) {
        String originPlanet = route.getOriginPlanetName().trim().toLowerCase();
        String destPlanet = route.getDestinationPlanetName().trim().toLowerCase();
        String originPort = route.getOriginSpaceportName().trim().toLowerCase();
        String destPort = route.getDestinationSpaceportName().trim().toLowerCase();

        boolean isOriginUnbound = originPlanet.isBlank() || originPlanet.equalsIgnoreCase("n/a");
        boolean isDestUnbound = destPlanet.isBlank() || destPlanet.equalsIgnoreCase("n/a");

        if (!isOriginUnbound && !isDestUnbound && originPlanet.equals(destPlanet)) {
            if (originPort.equals(destPort)) {
                throw new IllegalArgumentException("Route from a spaceport to itself on the same planet is not allowed.");
            } else {
                throw new IllegalArgumentException("Flights are not allowed between spaceports on the same planet.");
            }
        }

        return routeRepository.save(route);
    }


    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(RouteId id) {
        return routeRepository.findById(id).orElse(null);
    }
}
