import { LocationZoneDto } from "../types/locations";
import api from "./apiService";

export const locationService = {

  async getLocationZones(): Promise<LocationZoneDto[]> {
    const response = await api.get<LocationZoneDto[]>("/api/Location/Zone");
    return response.data;
  },

};
