import { QueryData } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { VehicleReleased } from "../entities/vehicleReleased";

export function useVehicleReleasedRepository() {
  async function createVehicleReleasedAsync(
    plate: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("vehicle_released")
      .insert({ plate: plate, created_by: userId });
    if (error) {
      throw error;
    }
  }

  async function vehicleAlreadyReleasedAsync(
    plate: string
  ) {
    const query = supabase
      .from("vehicle_released")
      .select("id, plate, created_at, created_by, user(username)")
      .eq("plate", plate);
    type vehicle = QueryData<typeof query>;
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const vehicleReleased: vehicle = data;
    return vehicleReleased[0];
  }

  async function getLastVehicleReleasedAsync(userId: string): Promise<VehicleReleased> {
    const query = supabase
      .from("vehicle_released")
      .select("id, plate, created_at, created_by, user(username)")
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    type vehicle = QueryData<typeof query>;
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const vehicleReleased: vehicle = data;
    return vehicleReleased[0];
  }

  return { createVehicleReleasedAsync, vehicleAlreadyReleasedAsync, getLastVehicleReleasedAsync };
}
