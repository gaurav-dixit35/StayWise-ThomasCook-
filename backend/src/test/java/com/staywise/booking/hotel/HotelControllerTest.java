package com.staywise.booking.hotel;

import com.staywise.booking.common.GlobalExceptionHandler;
import com.staywise.booking.hotel.dto.HotelSummaryDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HotelController.class)
@Import(GlobalExceptionHandler.class)
class HotelControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private HotelService hotelService;

    @Test
    void searchReturnsHotelSummariesAsJson() throws Exception {
        when(hotelService.search(isNull(), isNull(), isNull())).thenReturn(List.of(
                new HotelSummaryDto(1, "sea-glass-house", "Sea Glass House", "Mumbai", "Maharashtra", 4,
                        "A calm coastal residence.", "/assets/hotels/sea-glass-house.svg", List.of(),
                        "Harbour Deluxe Room", new BigDecimal("7800.00"), null)));

        mvc.perform(get("/api/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Sea Glass House"))
                .andExpect(jsonPath("$[0].pricePerNight").value(7800.0));
    }

    @Test
    void unknownHotelUsesStructuredNotFoundContract() throws Exception {
        when(hotelService.find(999, null, null)).thenThrow(new HotelNotFoundException());

        mvc.perform(get("/api/hotels/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("HOTEL_NOT_FOUND"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.path").value("/api/hotels/999"));
    }
}
