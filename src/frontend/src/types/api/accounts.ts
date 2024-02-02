export interface GenericResponse {
  status: string;
  message: string;
}

export interface IpAddressResponse {
  ipAddress: string;
}

export interface RegisterBody {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
}

export interface VerifyEmailBody {
  token: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  jwtToken: string;
  isProfileCompleted: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
  town: string | undefined;
  country: string | undefined;
  tags: string[];
}

export interface Location {
  latitude: number | undefined;
  longitude: number | undefined;
  postcode: string | undefined;
  town: string | undefined;
  country: string | undefined;
}

export interface CompleteProfileBody {
  profilePicture: File;
  additionalPictures: File[] | null;
  tags: string[];
  gender: Orientation;
  genderPreferences: Orientation;
  description: string;
  birthday: Date;
  latitude: number | undefined;
  longitude: number | undefined;
  town: string | undefined;
  country: string | undefined;
  postcode: string | undefined;
}

export interface CompleteProfileResponse {
  latitude: number | undefined;
  longitude: number | undefined;
  tags: string[];
}

export interface AccountsResponse {
  id: string;
  username: string;
  created: Date;
  profilePictureUrl: string;
  gender: number;
  genderPreferences: number;
  birthday: Date;
  description: string;
  country: string;
  town: string;
  latitude: number;
  longitude: number;
  tags: string[];
}

export interface AccountResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  created: Date;
  profilePictureUrl: string;
  additionalPicturesUrl: string[];
  gender: number;
  genderPreferences: number;
  birthday: Date;
  description: string;
  tags: string[];
  postcode: string;
  country: string;
  town: string;
  userCanChat: boolean;
  isLiked: boolean;
  isProfilesMatched: boolean;
}

export interface Pictures {
  additionalPicturesUrl: (string | null)[] | null;
}

export interface SettingsDataResponse {
  profilePictureUrl: string;
  description: string;
  gender: number;
  genderPreferences: number;
  hasPassword: boolean;
}

export interface UpdateProfileSettings {
  description: string;
  gender: number;
  genderPreferences: number;
  tags: string[];
}

export interface UpdatePasswordBody {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface ChangeProfilePictureResponse {
  profilePictureUrl: string;
}

export enum Orientation {
  Male = 0,
  Female = 1,
  Bisexual = 2,
}

export function convertProfileBodyToFormData(body: CompleteProfileBody) {
  const formData = new FormData();

  formData.append("profilePicture", body.profilePicture as File);
  formData.append("tags", JSON.stringify(body.tags));
  formData.append("gender", body.gender.toString());
  formData.append("genderPreferences", body.genderPreferences.toString());
  formData.append("description", body.description);

  body.additionalPictures?.forEach((picture) => {
    if (picture) formData.append("additionalPictures", picture as File);
  });

  if (body.latitude) formData.append("latitude", body.latitude.toString());
  if (body.longitude) formData.append("longitude", body.longitude.toString());
  if (body.town) formData.append("town", body.town);
  if (body.country) formData.append("country", body.country);
  if (body.postcode) formData.append("postcode", body.postcode);

  return formData;
}

export function convertCompleteProfileBodyToFormData(
  body: CompleteProfileBody
): FormData {
  const formData = convertProfileBodyToFormData(body);

  formData.append("birthday", body.birthday.toISOString());

  return formData;
}
