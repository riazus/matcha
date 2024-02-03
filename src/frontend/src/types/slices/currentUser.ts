export interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileCompleted: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
  town: string | undefined;
  country: string | undefined;
  tags: string[];
}

export interface Filter {
  maxAge: number;
  minAge: number;
  maxDistance: number | undefined;
  minDistance: number | undefined;
  minTagMatch: number;
  maxTagMatch: number;
  minFameRating: number;
  maxFameRating: number;
  orderByField: string;
  orderByAsc: boolean;
  isForBrowsing: boolean;
}
