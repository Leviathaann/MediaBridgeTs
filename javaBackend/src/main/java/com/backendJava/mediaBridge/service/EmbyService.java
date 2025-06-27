package com.backendJava.mediaBridge.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.backendJava.mediaBridge.model.DetailedMedia;
import com.backendJava.mediaBridge.model.EmbyAllMediaApiResponse;
import com.backendJava.mediaBridge.model.Media;

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
    public EmbyAllMediaApiResponse<Media> fetchAllOfSpecifiedMedia(String mediaType) {
        return embyWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/Users/{userId}/Items")
                        .queryParam("IncludeItemTypes", mediaType)
                        .queryParam("Recursive", "true")
                        .build(embyUserId))
                .header("X-Emby-Token", embyApiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<EmbyAllMediaApiResponse<Media>>() {
                })
                .block();
    }

    public DetailedMedia fetchMediaById(String id) {
        return embyWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("Users/{userId}/Items/{id}")
                        .build(embyUserId, id))
                .header("X-Emby-Token", embyApiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DetailedMedia>() {
                })
                .block();
    }

    public String embyUrlBuilder(String videoId) {
        return String.format("%s/Videos/%s/stream?static=true&X-Emby-Token=%s", embyServerUrl, videoId, embyApiKey);
    }

    public String fetchMediaImage(String id) {
        final DetailedMedia media = fetchMediaById(id);
        // Construct the image URL like the TypeScript version
        String imageURL = String.format("%s/emby/Items/%s/Images/Primary?tag=%s&X-Emby-Token=%s",
                embyServerUrl, id, media.getImageTags().getPrimary(), embyApiKey);
        return imageURL;
    }

    public ResponseEntity<Resource> streamVideo(String videoId, HttpHeaders requestHeaders) {
        String embyUrl = embyUrlBuilder(videoId);

        try {
            URL url = new URL(embyUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Get the content type from Emby
            String contentType = connection.getContentType();
            long contentLength = connection.getContentLengthLong();

            InputStream inputStream = connection.getInputStream();
            InputStreamResource resource = new InputStreamResource(inputStream);

            return ResponseEntity.ok()
                    // These headers are crucial!
                    .header("Content-Type", contentType != null ? contentType : "video/mp4")
                    .header("Accept-Ranges", "bytes")
                    .header("Content-Length", String.valueOf(contentLength))
                    .header("Content-Disposition", "inline") // "inline" = play in browser, not download
                    .body(resource);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}
