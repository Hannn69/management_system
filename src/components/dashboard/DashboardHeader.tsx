"use client";

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

const DESCRIPTIONS: Record<string, string> = {
  Home: "Overview of your assets, requests and activity.",
  Summary: "Overview of your assets, requests and activity.",
  Assets: "Browse and manage every asset in the inventory.",
  "Asset Models": "Models that group assets by manufacturer and category.",
  Categories: "Categories used to classify assets.",
  Manufacturers: "Manufacturers of the assets you track.",
  Suppliers: "Suppliers you purchase assets from.",
  Departments: "Departments that own or use assets.",
  Locations: "Sites, buildings and rooms where assets are kept.",
  Companies: "Companies the assets belong to.",
  "Status Labels": "Lifecycle states an asset can be in.",
  Users: "People with access to the management system.",
  "Role & Permission": "Roles and the permissions assigned to them.",
  Tasks: "Track and manage work items.",
  "Deployed Assets": "Assets that are currently checked out.",
  "Ready to Deploy": "Assets available to be checked out.",
  "Pending Assets": "Assets awaiting approval or processing.",
  "Un-deployable Assets": "Assets that cannot be deployed right now.",
  "BYOD Assets": "Bring-your-own-device assets.",
  "Requestable Assets": "Assets users can request.",
  Archive: "Archived and retired assets.",
  "Due for Audit": "Assets that are due for an audit.",
  "Due for Checkin": "Assets that are due to be checked back in.",
};

function describe(title: string) {
  if (DESCRIPTIONS[title]) return DESCRIPTIONS[title];
  if (title.startsWith("Create ")) return `Add a new ${title.slice(7).toLowerCase()}.`;
  if (title.startsWith("Update ") || title.startsWith("Edit "))
    return `Change the details of this ${title.slice(title.indexOf(" ") + 1).toLowerCase()}.`;
  if (title.endsWith(" Details")) return `Full details of this ${title.slice(0, -8).toLowerCase()}.`;
  return undefined;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const subtitle = description ?? describe(title);

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
    </header>
  );
}
