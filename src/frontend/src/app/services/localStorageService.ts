import { UserState } from "../../types/slices/currentUser";

export const persistUser = (user: UserState): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserState | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : null;
};

export const deleteUser = (): void => { localStorage.removeItem('user') }