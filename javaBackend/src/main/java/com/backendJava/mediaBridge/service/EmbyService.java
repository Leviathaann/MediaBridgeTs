package com.backendJava.mediaBridge.service;

import com.backendJava.mediaBridge.model.DetailedMedia;
import com.backendJava.mediaBridge.model.EmbyAllMediaApiResponse;
import com.backendJava.mediaBridge.model.Media;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class EmbyService {
    private final WebClient embyWebClient;

    // Injecting the base URL and API key from application properties
    @Value("${emby.api.userId}")
    private String embyUserId;
    @Value("${emby.api.key}")
    private String embyApiKey;
    @Value("${emby.api.url}")
    private String embyServerUrl;


    // Constructor injection for WebClient
    @Autowired
    public EmbyService(WebClient embyWebClient) {
        this.embyWebClient = embyWebClient;
    }

    // Method to fetch movies from Emby API
    public EmbyAllMediaApiResponse<Media> fetchAllOfSpecifiedMedia(String mediaType){
        return embyWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/Users/{userId}/Items")
                        .queryParam("IncludeItemTypes", mediaType)
                        .queryParam("Recursive", "true")
                        .build(embyUserId))
                .header("X-Emby-Token", embyApiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<EmbyAllMediaApiResponse<Media>>() {})
                .block();
    }

    public DetailedMedia fetchMediaById(String id){
        return embyWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("Users/{userId}/Items/{id}")
                        .build(embyUserId, id))
                .header("X-Emby-Token", embyApiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DetailedMedia>() {})
                .block();
    }

    public String fetchMediaImage(String id){
        final DetailedMedia media = fetchMediaById(id);
        // Construct the image URL like the TypeScript version
        String imageURL = String.format("%s/emby/Items/%s/Images/Primary?tag=%s&X-Emby-Token=%s", 
                                       embyServerUrl, id, media.getImageTags().getPrimary(), embyApiKey);
        return imageURL;
    }

    // Method to fetch a specific movie by ID

}

