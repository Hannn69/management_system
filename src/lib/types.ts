export interface AssetRecord {
  id: string | number;
  name: string;
  assetTag: string;
  serial?: string;
  image?: string;
  model?: { name: string } | string;
  category?: string;
  location?: { name: string } | string;
  status?: string;
  notes?: string;
  checkedOutTo?: string;
  purchaseCost?: number;
  currentValue?: number;
  slug?: string;
  accent?: string;
}

export interface AssetModelRecord {
  id: string | number;
  name: string;
  image?: string;
  modelNo?: string;
  modelNumber?: string;
  minQty?: number;
  assets?: number;
  assigned?: number;
  remaining?: number;
  percentRemaining?: number;
  archived?: number;
  category?: string;
  manufacturer?: string;
  eol?: number;
  eolMonths?: number;
  fieldset?: string;
  requireSerialNumber?: boolean;
  isRequestable?: boolean;
  notes?: string;
  slug?: string;
  accent?: string;
}

export interface CategoryRecord {
  id: string | number;
  name: string;
  image?: string;
  type?: string;
  assets?: number;
  items?: number;
  qty?: number;
  sendEmail?: boolean;
  acceptance?: boolean;
  slug?: string;
  accent?: string;
}

export interface CompanyRecord {
  id: string | number;
  name: string;
  image?: string;
  assets?: number;
  users?: number;
  slug?: string;
  accent?: string;
}

export interface DepartmentRecord {
  id: string | number;
  name: string;
  company?: string;
  manager?: string;
  location?: string;
  users?: number;
  slug?: string;
  accent?: string;
}

export interface LocationRecord {
  id: string | number;
  name: string;
  image?: string;
  parent?: string;
  city?: string;
  state?: string;
  country?: string;
  assets?: number;
  assignedTo?: number;
  currency?: string;
  slug?: string;
  accent?: string;
}

export interface ManufacturerRecord {
  id: string | number;
  name: string;
  image?: string;
  url?: string;
  supportPhone?: string;
  supportEmail?: string;
  assets?: number;
  slug?: string;
  accent?: string;
}

export interface StatusLabelRecord {
  id: string | number;
  name: string;
  type?: string;
  color?: string;
  assets?: number;
  slug?: string;
  accent?: string;
}

export interface SupplierRecord {
  id: string | number;
  name: string;
  image?: string;
  address?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  assets?: number;
  slug?: string;
  accent?: string;
}

export interface TaskRecord {
  id: string | number;
  key?: string;
  slug: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  updated?: string;
  updatedAt?: string;
  createdAt?: string;
  space?: string;
  workType?: string;
  description?: string;
  reporter?: string;
  labels?: string;
  dueDate?: string;
  startDate?: string;
  category?: string;
  team?: string;
  subtasks?: any[];
}
