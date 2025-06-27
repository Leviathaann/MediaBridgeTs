package com.backendJava.mediaBridge.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebClientConfig {
    @Value("${emby.api.url}")
    private String embyApiUrl;

    // This will be injected with the api key for auth
    @Bean
    public WebClient embyWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl(embyApiUrl)
                .build();
    }

    // CORS configuration
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3001", "http://localhost:3000", "http://localhost:5173",
                                "http://localhost:4200", "http://192.168.0.20:5174", "http://192.168.0.20:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

}
