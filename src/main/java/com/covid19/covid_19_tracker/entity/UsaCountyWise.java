package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usa_county_wise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsaCountyWise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uid")
    private Integer uid;

    @Column(name = "iso2")
    private String iso2;

    @Column(name = "iso3")
    private String iso3;

    @Column(name = "code3")
    private Integer code3;

    @Column(name = "fips")
    private Float fips;

    @Column(name = "admin2")
    private String admin2;

    @Column(name = "province_state")
    private String provinceState;

    @Column(name = "country_region")
    private String countryRegion;

    @Column(name = "lat")
    private Float lat;

    @Column(name = "longitude")
    private Float longitude;

    @Column(name = "combined_key")
    private String combinedKey;

    @Column(name = "date")
    private String date;

    @Column(name = "confirmed")
    private Integer confirmed;

    @Column(name = "deaths")
    private Integer deaths;
}