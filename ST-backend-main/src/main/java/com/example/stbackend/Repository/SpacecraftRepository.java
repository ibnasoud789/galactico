package com.example.stbackend.Repository;

import com.example.stbackend.Model.Spacecraft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpacecraftRepository extends JpaRepository<Spacecraft, String> {
    List<Spacecraft> findByCraftRangeGreaterThanEqual(int craftRange);
}
