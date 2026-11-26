package com.staywise.booking.common;

import com.staywise.booking.hotel.HotelNotFoundException;
import com.staywise.booking.booking.BookingNotFoundException;
import com.staywise.booking.booking.BookingDatesOutOfRangeException;
import com.staywise.booking.booking.CancellationNotAllowedException;
import com.staywise.booking.booking.RoomsUnavailableException;
import com.staywise.booking.common.DateInPastException;
import com.staywise.booking.common.DatesOutOfRangeException;
import com.staywise.booking.common.StayTooLongException;
import com.staywise.booking.hotel.HotelService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final ZoneId INDIA = ZoneId.of("Asia/Kolkata");

    @ExceptionHandler(HotelNotFoundException.class)
    ResponseEntity<ApiError> hotelNotFound(HotelNotFoundException exception, HttpServletRequest request) {
        return response(HttpStatus.NOT_FOUND, "HOTEL_NOT_FOUND", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(BookingNotFoundException.class)
    ResponseEntity<ApiError> bookingNotFound(BookingNotFoundException exception, HttpServletRequest request) {
        return response(HttpStatus.NOT_FOUND, "BOOKING_NOT_FOUND", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(RoomsUnavailableException.class)
    ResponseEntity<ApiError> soldOut(RoomsUnavailableException exception, HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "SOLD_OUT", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(CancellationNotAllowedException.class)
    ResponseEntity<ApiError> cancellationNotAllowed(CancellationNotAllowedException exception, HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "CANCELLATION_NOT_ALLOWED", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler({BookingDatesOutOfRangeException.class, DatesOutOfRangeException.class})
    ResponseEntity<ApiError> datesOutOfRange(RuntimeException exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "DATES_OUT_OF_RANGE", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(DateInPastException.class)
    ResponseEntity<ApiError> dateInPast(DateInPastException exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "DATE_IN_PAST", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(StayTooLongException.class)
    ResponseEntity<ApiError> stayTooLong(StayTooLongException exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "STAY_TOO_LONG", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> invalidBody(MethodArgumentNotValidException exception, HttpServletRequest request) {
        List<ApiError.FieldError> fields = exception.getBindingResult().getFieldErrors().stream()
                .map(this::fieldError).toList();
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Please check the highlighted fields.", request, fields);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiError> invalidParameter(ConstraintViolationException exception, HttpServletRequest request) {
        List<ApiError.FieldError> fields = exception.getConstraintViolations().stream()
                .map(violation -> new ApiError.FieldError(lastSegment(violation.getPropertyPath().toString()), violation.getMessage()))
                .toList();
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Please check your request.", request, fields);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class})
    ResponseEntity<ApiError> malformed(Exception exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "MALFORMED_REQUEST", "The request contains an invalid value.", request, List.of());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ApiError> badRequest(IllegalArgumentException exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "INVALID_DATE_RANGE", exception.getMessage(), request, List.of());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> unexpected(Exception exception, HttpServletRequest request) {
        LOGGER.error("Unhandled API error for {}", request.getRequestURI(), exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR",
                "Something went wrong. Please try again.", request, List.of());
    }

    private ApiError.FieldError fieldError(FieldError error) {
        return new ApiError.FieldError(error.getField(), error.getDefaultMessage() == null ? "Invalid value." : error.getDefaultMessage());
    }

    private ApiError error(HttpStatus status, String code, String message, HttpServletRequest request,
                           List<ApiError.FieldError> fields) {
        return new ApiError(OffsetDateTime.now(INDIA), status.value(), code, message, request.getRequestURI(), fields);
    }

    private ResponseEntity<ApiError> response(HttpStatus status, String code, String message,
                                              HttpServletRequest request, List<ApiError.FieldError> fields) {
        return ResponseEntity.status(status).body(error(status, code, message, request, fields));
    }

    private String lastSegment(String path) {
        int separator = path.lastIndexOf('.');
        return separator < 0 ? path : path.substring(separator + 1);
    }
}
