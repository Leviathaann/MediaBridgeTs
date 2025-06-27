package com.backendJava.mediaBridge.controller;

import com.backendJava.mediaBridge.service.EmbyService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stream")
@CrossOrigin
public class StreamController {

    private final EmbyService embyService;

    public StreamController(EmbyService embyService) {
        this.embyService = embyService;
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<Resource> streamVideo(
            @PathVariable String videoId,
            @RequestHeader HttpHeaders headers) {

        return embyService.streamVideo(videoId, headers);
    }

    @GetMapping("/test-url/{videoId}")
    public String testUrl(@PathVariable String videoId) {
        return embyService.embyUrlBuilder(videoId);
    }




}