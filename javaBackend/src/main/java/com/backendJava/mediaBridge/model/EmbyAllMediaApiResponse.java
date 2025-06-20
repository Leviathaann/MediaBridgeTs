package com.backendJava.mediaBridge.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class EmbyAllMediaApiResponse<T> {
    @JsonProperty("Items")
    private List<T> items;
    
    @JsonProperty("TotalRecordCount")
    private int totalRecordCount;
}
