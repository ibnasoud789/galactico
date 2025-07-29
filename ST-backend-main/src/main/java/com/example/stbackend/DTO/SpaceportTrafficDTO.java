package com.example.stbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class SpaceportTrafficDTO {
    private List<SpaceportDTO> connectedSpaceports;
    private List<FlightDetailsDTO> departures;
    private List<FlightDetailsDTO> arrivals;
}
