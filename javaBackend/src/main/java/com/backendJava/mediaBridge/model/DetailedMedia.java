package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.apache.catalina.User;

import java.util.List;

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
