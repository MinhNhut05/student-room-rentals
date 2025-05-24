/**
 * Debug utility to log FormData contents
 * @param {FormData} formData - The FormData object to debug
 */
export const debugFormData = (formData) => {
  console.log("FormData debug:");

  // Get all entries
  const entries = Array.from(formData.entries());

  // Log regular fields
  const regularFields = entries
    .filter((entry) => entry[0] !== "images")
    .map(([key, value]) => `${key}: ${value}`);
  console.log("Regular fields:", regularFields);

  // Log file fields
  const fileFields = entries
    .filter((entry) => entry[0] === "images")
    .map(([key, file]) => ({
      key,
      name: file.name,
      type: file.type,
      size: `${Math.round(file.size / 1024)} KB`,
    }));

  if (fileFields.length > 0) {
    console.log(`Files (${fileFields.length}):`, fileFields);
  } else {
    console.warn("⚠️ No files found in FormData with key 'images'!");

    // Check if files exist with different keys
    const otherFileEntries = entries.filter(
      (entry) =>
        entry[1] instanceof File ||
        (typeof entry[1] === "object" && entry[1].name && entry[1].type)
    );

    if (otherFileEntries.length > 0) {
      console.warn(
        "Found files with incorrect keys:",
        otherFileEntries.map(([key]) => key)
      );
      console.warn("Fix: Use 'images' as the key for all files");
    }
  }
};
