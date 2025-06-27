package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;

@Data
public class DetailedMedia {

    @JsonProperty("Name")
    private String name;

    @JsonProperty("Id")
    private String id;

    @JsonProperty("DateCreated")
    private String dateCreated;

    @JsonProperty("FileName")
    private String fileName;

    @JsonProperty("Type")
    private String Type;

    @JsonProperty("UserData")
    private UserData userData;

    @JsonProperty("ImageTags")
    private ImageTags imageTags;

    @JsonProperty("BackdropImageTags")
    private List<String> backdropImageTags;
}
