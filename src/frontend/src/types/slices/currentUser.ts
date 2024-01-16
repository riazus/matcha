export interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileCompleted: boolean;
  latitude: number | null;
  longitude: number | null;
  tags: string[];
}
