import sharp from "sharp";

export const compressImage = async (buffer: Buffer) => {
  return await sharp(buffer)
    .resize({
      width: 1920,
      height: 1080,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
};
