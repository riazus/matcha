export interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileCompleted: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
  town: string;
  country: string;
  tags: string[];
}

export interface Filter {
  maxAge: number;
  minAge: number;
  maxDistance: number | undefined;
  minDistance: number | undefined;
  minTagMatch: number;
  maxTagMatch: number;
  orderByField: string;
  orderByAsc: boolean;
  isForBrowsing: boolean;
}
