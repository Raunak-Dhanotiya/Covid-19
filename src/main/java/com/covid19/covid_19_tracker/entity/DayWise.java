package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "day_wise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayWise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private String date;

    @Column(name = "confirmed")
    private Integer confirmed;

    @Column(name = "deaths")
    private Integer deaths;

    @Column(name = "recovered")
    private Integer recovered;

    @Column(name = "active")
    private Integer active;

    @Column(name = "new_cases")
    private Integer newCases;

    @Column(name = "new_deaths")
    private Integer newDeaths;

    @Column(name = "new_recovered")
    private Integer newRecovered;

    @Column(name = "deaths_per_100_cases")
    private Float deathsPer100Cases;

    @Column(name = "recovered_per_100_cases")
    private Float recoveredPer100Cases;

    @Column(name = "deaths_per_100_recovered")
    private Float deathsPer100Recovered;

    @Column(name = "number_of_countries")
    private Integer numberOfCountries;
}