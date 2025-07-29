package com.example.stbackend.Repository;

import com.example.stbackend.Model.Spaceport;
import com.example.stbackend.Model.SpaceportId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceportRepository extends JpaRepository<Spaceport, SpaceportId> {
}
