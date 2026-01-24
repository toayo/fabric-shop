const FALLBACK_IMAGE = "/products/placeholder.svg";

export const getProductImageUrl = (slug: string, filename?: string) => {
  if (!filename) {
    return FALLBACK_IMAGE;
  }
  return `/products/${slug}/${filename}`;
};

export const getProductImageUrls = (slug: string, filenames: string[]) => {
  if (!filenames || filenames.length === 0) {
    return [FALLBACK_IMAGE];
  }
  return filenames.map((filename) => getProductImageUrl(slug, filename));
};
