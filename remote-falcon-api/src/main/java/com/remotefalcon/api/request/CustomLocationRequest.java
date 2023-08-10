package com.remotefalcon.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomLocationRequest {
  private Float remoteLatitude;
  private Float remoteLongitude;
}
