export interface GenericResponse {
  status: string;
  message: string;
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
}

export interface CompleteProfileBody {
  profilePicture: File;
  additionalPictures: File[] | null;
  tags: string[];
  gender: number;
  genderPreferences: number;
  description: string;
  birthday: Date;
  latitude: number | null;
  longitude: number | null;
  town: string | null;
  country: string | null;
  postcode: string | null;
}

export interface AccountsResponse {
  id: string;
  username: string;
  created: Date;
  profilePictureUrl: string;
  gender: number;
  genderPreferences: number;
  birthday: Date;
  country: string;
  town: string;
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

export interface AddressData {
  latitude: number;
  longitude: number;
  postCode: string;
  town: string;
  country: string;
}

export function convertCompleteProfileBodyToFormData(
  body: CompleteProfileBody
): FormData {
  const formData = new FormData();

  formData.append("profilePicture", body.profilePicture);
  formData.append("tags", JSON.stringify(body.tags));
  formData.append("gender", body.gender.toString());
  formData.append("genderPreferences", body.genderPreferences.toString());
  formData.append("description", body.description);
  formData.append("birthday", body.birthday.toISOString());

  body.additionalPictures?.forEach((picture) => {
    formData.append("additionalPictures", picture);
  });

  if (body.latitude) formData.append("latitude", body.latitude.toString());
  if (body.longitude) formData.append("longitude", body.longitude.toString());
  if (body.town) formData.append("town", body.town);
  if (body.country) formData.append("country", body.country);
  if (body.postcode) formData.append("postcode", body.postcode);

  return formData;
}
