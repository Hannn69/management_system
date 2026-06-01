export interface RolePermissionDefinition {
  id: number;
  name: string;
  label: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionRecord {
  id: number;
  roleId: number;
  permissionId: number;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  permission?: RolePermissionDefinition;
}

export interface RoleRecord {
  id: number;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: RolePermissionRecord[];
}

export interface RoleFormState {
  name: string;
  description: string;
}

export const emptyRoleForm: RoleFormState = {
  name: "",
  description: "",
};

export function mapRoleToForm(role: Partial<RoleRecord>): RoleFormState {
  return {
    name: role.name || "",
    description: role.description || "",
  };
}
