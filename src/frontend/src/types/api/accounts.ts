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
  latitude: number | undefined;
  longitude: number | undefined;
  tags: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  postcode: string;
  town: string;
  country: string;
}

export interface ProfileBody {
  profilePicture: File | null;
  additionalPictures: (File | null)[] | null;
  tags: string[];
  gender: number;
  genderPreferences: number;
  description: string;
  location: Location;
}

export interface CompleteProfileBody {
  profileBody: ProfileBody;
  birthday: Date;
  latitude: number | undefined;
  longitude: number | undefined;
  town: string | null;
  country: string | null;
  postcode: string | null;
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
  profilePictureUrl: string;
  additionalPicturesUrl: (string | null)[] | null;
}

export function convertProfileBodyToFormData(body: ProfileBody) {
  const formData = new FormData();
  
  formData.append("profilePicture", body.profilePicture as File);
  formData.append("tags", JSON.stringify(body.tags));
  formData.append("gender", body.gender.toString());
  formData.append("genderPreferences", body.genderPreferences.toString());
  formData.append("description", body.description);
  
  body.additionalPictures?.forEach((picture) => {
    if (picture)
      formData.append("additionalPictures", picture as File);
  });
  
  if (body.location.latitude) formData.append("latitude", body.location.latitude.toString());
  if (body.location.longitude) formData.append("longitude", body.location.longitude.toString());
  if (body.location.town) formData.append("town", body.location.town);
  if (body.location.country) formData.append("country", body.location.country);
  if (body.location.postcode) formData.append("postcode", body.location.postcode);
  
  return formData; 
}

export function convertCompleteProfileBodyToFormData(
  body: CompleteProfileBody
): FormData {
  const formData = convertProfileBodyToFormData(body.profileBody);

  formData.append("birthday", body.birthday.toISOString());

  return formData;
}