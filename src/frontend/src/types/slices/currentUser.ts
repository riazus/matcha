export interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileCompleted: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
}
