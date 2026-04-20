/** Matches the Mongoose Shop document shape returned by the backend */
export interface Store {
  _id: string;
  id?: string;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  is_open?: boolean;
  phone?: string;
  description?: string;
  rejection_reason?: string;
  commission_percent?: number;
  service_radius_km?: number;
  open_time?: string;
  close_time?: string;
  tags?: string[];
  logo_url?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  owner_user_id?: {
    _id?: string;
    phone?: string;
    name?: string;
    role?: string;
  } | string;
  createdAt?: string;
  updatedAt?: string;
}
