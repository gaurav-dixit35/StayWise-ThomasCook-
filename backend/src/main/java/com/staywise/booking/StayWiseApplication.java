package com.staywise.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StayWiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(StayWiseApplication.class, args);
    }
}
