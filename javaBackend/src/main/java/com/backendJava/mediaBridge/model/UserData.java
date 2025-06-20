package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserData {
    @JsonProperty("PlaybackPositionTicks")
    private long playbackPositionTicks;
    
    @JsonProperty("PlayCount")
    private int playCount;
    
    @JsonProperty("IsFavorite")
    private boolean isFavorite;
    
    @JsonProperty("Played")
    private boolean played;
}