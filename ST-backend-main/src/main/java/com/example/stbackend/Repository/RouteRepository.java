package com.example.stbackend.Repository;

import com.example.stbackend.Model.Route;
import com.example.stbackend.Model.RouteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, RouteId> {
}
