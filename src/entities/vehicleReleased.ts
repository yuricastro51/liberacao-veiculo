export interface VehicleReleased {
  id: string;
  plate: string;
  created_by: string;
  created_at: string;
  user: { username: string }[];
}