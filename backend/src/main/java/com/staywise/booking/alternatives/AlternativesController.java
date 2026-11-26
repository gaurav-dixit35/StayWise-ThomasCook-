package com.staywise.booking.alternatives;

import com.staywise.booking.alternatives.dto.AlternativesResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/hotels/{hotelId}/alternatives")
public class AlternativesController {
    private final AlternativesService alternativesService;

    public AlternativesController(AlternativesService alternativesService) {
        this.alternativesService = alternativesService;
    }

    @GetMapping
    public AlternativesResponse get(@PathVariable long hotelId,
                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return alternativesService.findAlternatives(hotelId, checkIn, checkOut);
    }
}
