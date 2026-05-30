/** Curated Unsplash placeholders — swap for owned assets in production */

const UNSPLASH = {
  // A breathtaking, wide-angle shot of a safari vehicle on the African savannah
  hero: '/African_savannah.jpg',

  // A warm, atmospheric sunset over the savannah—perfect for a clean login/auth background
  auth: '/sunset_savannah.jpg',

  // Maasai Mara: Iconic shot of a lion on the open plains
  mara: '/lion_on_plains.jpg',

  // Amboseli: An elephant with the majestic Mount Kilimanjaro in the background
  amboseli: '/mtKilimanjaro.jpg',

  // Tsavo: Stunning elephants wandering through a dusty, expansive landscape
  tsavo: '/elephants_wandering.jpg',

  // Samburu: A beautiful leopard resting in the brush
  samburu: '/Samburu_Leopard.jpg',

  // Lake Nakuru: Great flocks of pink flamingos on the water
  nakuru: '/flock_of_flamingos.jpg',

  // Default: A classic silhouette of acacia trees against an African sunset
  default: '/silhouette_acacia_trees.jpg',
} as const;

const PACKAGE_IMAGES: Record<string, string> = {
  pkg_classic_mara: UNSPLASH.mara,
  pkg_big_five: UNSPLASH.amboseli,
  pkg_photographer: UNSPLASH.nakuru,
  pkg_family_safari: UNSPLASH.amboseli,
  pkg_luxury_escape: UNSPLASH.samburu,
};

const DESTINATION_IMAGES: Record<string, string> = {
  dest_maasai_mara: UNSPLASH.mara,
  dest_amboseli: UNSPLASH.amboseli,
  dest_tsavo: UNSPLASH.tsavo,
  dest_samburu: UNSPLASH.samburu,
  dest_lake_nakuru: UNSPLASH.nakuru,
};

export function getPackageImageUrl(
  packageId?: string | null,
  destinations?: string[] | null,
): string {
  if (packageId && PACKAGE_IMAGES[packageId]) {
    return PACKAGE_IMAGES[packageId];
  }
  const dest = destinations?.[0]?.toLowerCase() ?? '';
  if (dest.includes('mara')) return UNSPLASH.mara;
  if (dest.includes('amboseli')) return UNSPLASH.amboseli;
  if (dest.includes('tsavo')) return UNSPLASH.tsavo;
  if (dest.includes('samburu')) return UNSPLASH.samburu;
  if (dest.includes('nakuru')) return UNSPLASH.nakuru;
  return UNSPLASH.default;
}

export function getDestinationImageUrl(
  destinationId?: string | null,
  name?: string | null,
): string {
  if (destinationId && DESTINATION_IMAGES[destinationId]) {
    return DESTINATION_IMAGES[destinationId];
  }
  const n = name?.toLowerCase() ?? '';
  if (n.includes('mara')) return UNSPLASH.mara;
  if (n.includes('amboseli')) return UNSPLASH.amboseli;
  if (n.includes('tsavo')) return UNSPLASH.tsavo;
  if (n.includes('samburu')) return UNSPLASH.samburu;
  if (n.includes('nakuru')) return UNSPLASH.nakuru;
  return UNSPLASH.default;
}

export function getHeroImageUrl(): string {
  return UNSPLASH.hero;
}

export function getAuthImageUrl(): string {
  return UNSPLASH.auth;
}
