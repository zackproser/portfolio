export const importLogo = async (path) => {
  try {
    const image = await import(`@/public${path}`);
    return image.default;
  } catch (error) {
    console.error(`Error importing image: ${path}`, error);
    return null;
  }
};
