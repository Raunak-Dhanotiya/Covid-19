package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "covid")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Covid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "province_state")
    private String provinceState;

    @Column(name = "country_region")
    private String countryRegion;

    @Column(name = "lat")
    private Float lat;

    @Column(name = "longitude")
    private Float longitude;

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

    @Column(name = "who_region")
    private String whoRegion;
}