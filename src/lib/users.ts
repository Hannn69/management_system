export interface SelectOption {
  id: number;
  name: string;
}

export interface ApiUserRecord {
  id: number | string;
  firstName?: string;
  lastName?: string;
  email: string;
  username?: string;
  displayName?: string;
  loginEnabled?: boolean;
  phone?: string;
  phoneNumber?: string;
  companyId?: number | null;
  locationId?: number | null;
  company?: SelectOption | string | null;
  location?: SelectOption | string | null;
}

export interface UserFormState {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  displayName: string;
  phoneNumber: string;
  companyId: string;
  locationId: string;
  loginEnabled: boolean;
  password: string;
  confirmPassword: string;
}

export const emptyUserForm: UserFormState = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  displayName: "",
  phoneNumber: "",
  companyId: "",
  locationId: "",
  loginEnabled: true,
  password: "",
  confirmPassword: "",
};

export function mapUserToForm(user: ApiUserRecord): UserFormState {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    username: user.username || "",
    displayName: user.displayName || "",
    phoneNumber: user.phoneNumber || user.phone || "",
    companyId:
      user.companyId != null
        ? String(user.companyId)
        : typeof user.company === "object" && user.company?.id != null
          ? String(user.company.id)
          : "",
    locationId:
      user.locationId != null
        ? String(user.locationId)
        : typeof user.location === "object" && user.location?.id != null
          ? String(user.location.id)
          : "",
    loginEnabled: user.loginEnabled ?? true,
    password: "",
    confirmPassword: "",
  };
}

export function getUserFullName(user: Pick<ApiUserRecord, "firstName" | "lastName" | "displayName" | "username" | "email">) {
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return name || user.displayName || user.username || user.email;
}
