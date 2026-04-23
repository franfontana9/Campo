import type {
  Country,
  Currency,
  GrainType,
  ListingStatus,
  PriceMode,
  UserType,
} from "./constants";

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  country: Country | string;
  region: string;
  city: string;
  user_type: UserType;
  role: "user" | "admin";
  created_at: string;
};

export type Listing = {
  id: string;
  user_id: string;
  grain_type: GrainType;
  tonnage: number;
  country: Country | string;
  region: string;
  city: string;
  price: number | null;
  currency: Currency;
  price_mode: PriceMode;
  delivery_date: string;
  description: string;
  status: ListingStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  seller?: Pick<
    Profile,
    "id" | "full_name" | "user_type" | "country" | "region" | "city"
  >;
};

export type Interest = {
  id: string;
  listing_id: string;
  buyer_id: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};
