/**
 * Utility function to get full image URL from API
 * Handles both relative and absolute URLs
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    // Return a data URI placeholder for missing images
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%23475569" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  // If it's already a full URL (starts with http:// or https://), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path starting with /storage, it's already correct
  if (imagePath.startsWith('/storage/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  }

  // If it's a relative path, construct the full URL
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Get base URL from environment or default to localhost
  // Extract base URL from API URL (remove /api suffix if present)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // Construct full URL - backend returns URLs like /storage/photos/xxx.jpg
  // So we need to handle both cases
  if (cleanPath.startsWith('storage/')) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  return `${baseUrl}/storage/${cleanPath}`;
};

/**
 * Get profile photo URL
 */
export const getProfilePhotoUrl = (photo: string | null | undefined): string => {
  return getImageUrl(photo);
};

/**
 * Get course thumbnail URL
 */
export const getCourseThumbnailUrl = (thumbnail: string | null | undefined): string => {
  return getImageUrl(thumbnail);
};

