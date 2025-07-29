package com.example.stbackend.Repository;

import com.example.stbackend.DTO.SpaceportDTO;
import com.example.stbackend.Model.Flight;
import com.example.stbackend.DTO.FlightDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.stbackend.Model.DayOfWeekEnum;
import java.time.LocalTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, String> {
    @Query("SELECT COUNT(f) FROM Flight f WHERE f.originSpaceportName = :name AND f.originPlanetName = :planet AND f.dayOfWeek = :day")
    long countByOriginSpaceportAndDay(@Param("name") String name,
                                      @Param("planet") String planet,
                                      @Param("day") DayOfWeekEnum day);

    @Query("SELECT COUNT(f) FROM Flight f WHERE f.destinationSpaceportName = :name AND f.destinationPlanetName = :planet AND f.dayOfWeek = :day")
    long countByDestinationSpaceportAndDay(@Param("name") String name,
                                           @Param("planet") String planet,
                                           @Param("day") DayOfWeekEnum day);

    @Query("""
        SELECT new com.example.stbackend.DTO.FlightDTO(
            f.flightNumber,
            f.originSpaceportName,
            f.originPlanetName,
            f.destinationSpaceportName,
            f.destinationPlanetName,
            f.spacecraftType,
            f.dayOfWeek,
            f.departureTime,
            f.flightTime,
            s.capacity,
            s.craftRange,
            r.distance
        )
        FROM Flight f
        JOIN Spacecraft s ON f.spacecraftType = s.typeName
        JOIN Route r ON 
            f.originSpaceportName = r.originSpaceportName AND 
            f.originPlanetName = r.originPlanetName AND 
            f.destinationSpaceportName = r.destinationSpaceportName AND 
            f.destinationPlanetName = r.destinationPlanetName
        WHERE f.originSpaceportName = :originSpaceportName
          AND f.originPlanetName = :originPlanetName
          AND f.destinationSpaceportName = :destinationSpaceportName
          AND f.destinationPlanetName = :destinationPlanetName
        """)
    List<FlightDTO> findFlightsByRoute(
            @Param("originSpaceportName") String originSpaceportName,
            @Param("originPlanetName") String originPlanetName,
            @Param("destinationSpaceportName") String destinationSpaceportName,
            @Param("destinationPlanetName") String destinationPlanetName
    );

    @Query("""
  SELECT DISTINCT new com.example.stbackend.DTO.SpaceportDTO(
    f.originSpaceportName, f.originPlanetName
  )
  FROM Flight f
  WHERE f.destinationSpaceportName = :port
    AND f.destinationPlanetName = :planet
""")
    List<SpaceportDTO> findOriginsTo(@Param("port") String port, @Param("planet") String planet);

    @Query("""
  SELECT DISTINCT new com.example.stbackend.DTO.SpaceportDTO(
    f.destinationSpaceportName, f.destinationPlanetName
  )
  FROM Flight f
  WHERE f.originSpaceportName = :port
    AND f.originPlanetName = :planet
""")
    List<SpaceportDTO> findDestinationsFrom(@Param("port") String port, @Param("planet") String planet);

    List<Flight> findByOriginSpaceportNameAndOriginPlanetName(String port, String planet);
    List<Flight> findByDestinationSpaceportNameAndDestinationPlanetName(String port, String planet);

    // New: find departing flights by origin, day and departure-time window
    List<Flight> findByOriginSpaceportNameAndOriginPlanetNameAndDayOfWeekAndDepartureTimeBetween(
            String originSpaceportName,
            String originPlanetName,
            DayOfWeekEnum dayOfWeek,
            LocalTime earliest,
            LocalTime latest
    );
}
