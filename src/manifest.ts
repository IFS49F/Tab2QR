import pkg from "../package.json";

const shared = {
  author: pkg.author,
  description: pkg.description,
  name: pkg.displayName ?? pkg.name,
  version: pkg.version,
  icons: {
    19: "icons/19.png",
    38: "icons/38.png",
    48: "icons/48.png",
    128: "icons/128.png",
  },
  permissions: ["activeTab"],
  optional_permissions: ["clipboardWrite", "downloads"],
  browser_specific_settings: {
    gecko: {
      id: "{dc3dce74-bf98-4eb4-adc4-75597edb6c5c}",
      strict_min_version: "109.0",
    },
  },
};

const browserAction = {
  default_title: "Tab2QR",
  default_icon: {
    19: "icons/19.png",
    38: "icons/38.png",
  },
  default_popup: "src/entries/popup/index.html",
};

const ManifestV2 = {
  ...shared,
  browser_action: browserAction,
};

const ManifestV3 = {
  ...shared,
  action: browserAction,
  permissions: shared.permissions as chrome.runtime.ManifestPermissions[],
  optional_permissions:
    shared.optional_permissions as chrome.runtime.ManifestPermissions[],
};

export function getManifest(
  manifestVersion: number
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  switch (manifestVersion) {
    case 2:
      return {
        ...ManifestV2,
        manifest_version: manifestVersion,
      };
    case 3:
      return {
        ...ManifestV3,
        manifest_version: manifestVersion,
      };
    default:
      throw new Error(
        `Missing manifest definition for manifestVersion ${manifestVersion}`
      );
  }
}
