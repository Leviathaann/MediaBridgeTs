package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ImageTags {
    @JsonProperty("Primary")
    private String primary;

    @JsonProperty("Logo")
    private String logo;

    @JsonProperty("Thumb")
    private String thumb;
}