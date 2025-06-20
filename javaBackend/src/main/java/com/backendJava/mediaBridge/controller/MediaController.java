package com.backendJava.mediaBridge.controller;

import com.backendJava.mediaBridge.model.DetailedMedia;
import com.backendJava.mediaBridge.model.EmbyAllMediaApiResponse;
import com.backendJava.mediaBridge.model.Media;
import com.backendJava.mediaBridge.service.EmbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MediaController {

    private final EmbyService embyService;

    @Autowired
    public MediaController(EmbyService embyService) {
        this.embyService = embyService;
    }

    @GetMapping(path = "/movies")
    public EmbyAllMediaApiResponse<Media> getMovies() {
        return embyService.fetchAllOfSpecifiedMedia("Movie");
    }

    @GetMapping(path = "/movies/{id}")
    public DetailedMedia getMoviesById(@PathVariable String id) {
        return embyService.fetchMediaById(id);
    }

    @GetMapping(path = "/movies/{id}/{image}")
    public String getMoviesImageById(@PathVariable String id, @PathVariable String image) {
        String imageUrl = embyService.fetchMediaImage(id);
        return "\"" + imageUrl + "\"";
    }

    @GetMapping(path = "/shows")
    public EmbyAllMediaApiResponse<Media> getShows() {
        return embyService.fetchAllOfSpecifiedMedia("Series");
    }

    @GetMapping(path = "/shows/{id}")
    public DetailedMedia getShowsById(@PathVariable String id) {
        return embyService.fetchMediaById(id);
    }

    @GetMapping(path = "/shows/{id}/{image}")
    public String getShowImageById(@PathVariable String id, @PathVariable String image) {
        return embyService.fetchMediaImage(id);
    }
}
