// Random sample data used by the "Auto fill" button on the create pages.

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const int = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const digits = (n: number) => Array.from({ length: n }, () => int(0, 9)).join("");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Picks the id of a random option from a dropdown list, or "" when the list is empty.
export const pickId = (options: ReadonlyArray<{ id: number | string }>): string =>
  options.length ? String(pick(options).id) : "";

const FIRST_NAMES = ["Sokha", "Dara", "Vanna", "Sreymom", "Rith", "Chantha", "Sophea", "Kosal", "Maly", "Pisey"];
const LAST_NAMES = ["Chan", "Sok", "Lim", "Heng", "Kem", "Phan", "Ly", "Meas", "Tan", "Vong"];
const COMPANY_WORDS = ["Apex", "Nova", "Lotus", "Mekong", "Angkor", "Zenith", "Orbit", "Vertex", "Summit", "Delta"];
const COMPANY_SUFFIXES = ["Technologies", "Solutions", "Group", "Holdings", "Systems", "Co., Ltd"];
const CITIES = ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot", "Kampong Cham"];
const STREETS = ["Norodom Blvd", "Sihanouk Blvd", "Monivong Blvd", "Street 51", "Street 271", "Preah Sisowath Quay"];
const NOTES = [
  "Sample record created with auto fill.",
  "Test data - safe to delete.",
  "Generated for demo purposes.",
];
const MANUFACTURERS = ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "Samsung", "Cisco"];
const MODELS = ["Latitude 7440", "EliteBook 840", "ThinkPad T14", "MacBook Pro 14", "ZenBook 14", "Aspire 5"];
const CATEGORIES = ["Laptops", "Desktops", "Monitors", "Printers", "Phones", "Network Gear"];
const DEPARTMENTS = ["IT", "Finance", "Human Resources", "Marketing", "Operations", "Sales"];
const LOCATIONS = ["Head Office", "Branch Office", "Warehouse", "Data Center", "Remote Hub"];
const STATUSES = ["Ready to Deploy", "In Repair", "Pending Audit", "Retired", "Lost / Stolen"];

// Names must be unique in the database, so every generated name gets a short number.
const unique = (name: string) => `${name} ${digits(3)}`;

const companyName = () => `${pick(COMPANY_WORDS)} ${pick(COMPANY_SUFFIXES)}`;
const phone = () => `0${pick(["12", "15", "16", "17", "69", "70", "77", "92"])}${digits(6)}`;
const emailFor = (name: string) => `${slug(name)}${int(1, 99)}@example.com`;
const note = () => pick(NOTES);
const dateOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const sample = {
  supplier() {
    const name = unique(companyName());
    return {
      name,
      contactName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      phone: phone(),
      email: `sales@${slug(name)}.com`,
      url: `https://www.${slug(name)}.com`,
      address: `#${int(1, 250)}, ${pick(STREETS)}`,
      city: pick(CITIES),
      state: pick(CITIES),
      notes: note(),
    };
  },

  company() {
    const name = unique(companyName());
    return { name, phone: phone(), fax: phone(), email: `info@${slug(name)}.com`, notes: note() };
  },

  manufacturer() {
    const name = unique(pick(MANUFACTURERS));
    const domain = `https://www.${slug(name)}.com`;
    return {
      name,
      url: domain,
      supportUrl: `${domain}/support`,
      warrantyLookupUrl: `${domain}/warranty`,
      supportPhone: phone(),
      supportEmail: `support@${slug(name)}.com`,
      notes: note(),
    };
  },

  category() {
    return {
      name: unique(pick(CATEGORIES)),
      type: pick(["Asset", "Accessory", "Consumable", "Component", "License"]),
      eula: "",
      useDefaultEula: true,
      requireConfirmation: false,
      emailNotification: false,
      notes: note(),
    };
  },

  statusLabel() {
    return { name: unique(pick(STATUSES)), type: pick(["Deployable", "Undeployable", "Archived", "Pending"]), notes: note() };
  },

  department(opts: { companies: ReadonlyArray<{ id: number | string }>; locations: ReadonlyArray<{ id: number | string }>; managers: ReadonlyArray<{ id: number | string }> }) {
    return {
      name: unique(pick(DEPARTMENTS)),
      companyId: pickId(opts.companies),
      locationId: pickId(opts.locations),
      managerId: pickId(opts.managers),
      phone: phone(),
      notes: note(),
    };
  },

  location(opts: { companies: ReadonlyArray<{ id: number | string }> }) {
    return {
      name: unique(pick(LOCATIONS)),
      companyId: pickId(opts.companies),
      phone: phone(),
      address: `#${int(1, 250)}, ${pick(STREETS)}`,
      address2: "",
      city: pick(CITIES),
      state: pick(CITIES),
      country: "Cambodia",
      zip: `12${digits(3)}`,
      notes: note(),
    };
  },

  assetModel(opts: { categories: ReadonlyArray<{ id: number | string }>; manufacturers: ReadonlyArray<{ id: number | string }> }) {
    return {
      name: unique(pick(MODELS)),
      categoryId: pickId(opts.categories),
      manufacturerId: pickId(opts.manufacturers),
      modelNumber: `${pick(["LT", "DT", "MN", "PR"])}-${digits(4)}`,
      minQty: String(int(1, 10)),
      eolMonths: String(pick([24, 36, 48, 60])),
      notes: note(),
    };
  },

  user(opts: { companies: ReadonlyArray<{ id: number | string }>; locations: ReadonlyArray<{ id: number | string }> }) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    return {
      firstName,
      lastName,
      email: emailFor(`${firstName}.${lastName}`),
      username: `${slug(firstName)}${slug(lastName)}${int(1, 99)}`,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phone(),
      companyId: pickId(opts.companies),
      locationId: pickId(opts.locations),
      password: "password123",
      confirmPassword: "password123",
    };
  },

  asset(opts: {
    companies: ReadonlyArray<{ id: number | string }>;
    models: ReadonlyArray<{ id: number | string }>;
    statuses: ReadonlyArray<{ id: number | string }>;
    locations: ReadonlyArray<{ id: number | string }>;
    suppliers: ReadonlyArray<{ id: number | string }>;
  }) {
    return {
      companyId: pickId(opts.companies),
      modelId: pickId(opts.models),
      statusId: pickId(opts.statuses),
      locationId: pickId(opts.locations),
      supplierId: pickId(opts.suppliers),
      notes: note(),
      name: `Asset ${digits(4)}`,
      warrantyMonths: String(pick([12, 24, 36])),
      orderNumber: `PO-${digits(5)}`,
      purchaseDate: dateOffset(-int(30, 365)),
      eolDate: dateOffset(int(365, 1460)),
      purchaseCost: String(int(300, 2500)),
      serial: `SN${digits(8)}`,
    };
  },
};
