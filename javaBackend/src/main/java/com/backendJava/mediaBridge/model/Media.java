package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class Media {
	@JsonProperty("Name")
	private String name;
	
	@JsonProperty("Id")
	private String id;
	
	@JsonProperty("RunTimeTicks")
	private String runTimeTicks;

	@JsonProperty("IsFolder")
	private boolean isFolder;
	
	@JsonProperty("Type")
	private String type;
	
	@JsonProperty("UserData")
	private UserData userData;
	
	@JsonProperty("ImageTags")
	private ImageTags imageTags;
	
	@JsonProperty("BackdropImageTags")
	private List<String> backdropImageTags;
	
	@JsonProperty("MediaType")
	private String mediaType;
}
