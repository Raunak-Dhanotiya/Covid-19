package com.covid19.covid_19_tracker.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        if (path == null || path.isEmpty()) {
            path = request.getRequestURI();
        }

        if (

        path.startsWith("/api/auth") ||

                path.startsWith("/actuator") ||

                path.startsWith("/api/country-wise") ||

                path.startsWith("/api/worldometer") ||

                path.startsWith("/api/day-wise") ||

                path.startsWith("/api/covid") ||

                path.startsWith("/api/full-grouped") ||

                path.startsWith("/api/usa-county")

        ) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        String token = authHeader.substring(7);

        String username = null;

        try {

            username = jwtService.extractUsername(token);

        } catch (Exception e) {

            SecurityContextHolder.clearContext();
        }

        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            try {

                UserDetails userDetails = userDetailsService
                        .loadUserByUsername(username);

                if (jwtService.validateToken(token)) {

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authToken.setDetails(

                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)

                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                }

            } catch (UsernameNotFoundException e) {

                SecurityContextHolder.clearContext();

            }
        }

        filterChain.doFilter(
                request,
                response);
    }
}