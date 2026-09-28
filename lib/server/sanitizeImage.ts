import sharp from 'sharp';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const formats = {jpeg: ['jpg','image/jpeg'], png: ['png','image/png'], webp: ['webp','image/webp'], gif: ['gif','image/gif']} as const;
export async function sanitizeImage(input: Uint8Array) {
  if (!input.length || input.length > MAX_IMAGE_BYTES) throw new Error('Invalid image size');
  const pipeline = sharp(input, {animated: true, limitInputPixels: 40_000_000, failOn: 'warning'});
  const meta = await pipeline.metadata();
  if (!meta.format || !(meta.format in formats) || !meta.width || !meta.height || meta.width * meta.height > 40_000_000 || (meta.pages ?? 1) > 200) throw new Error('Invalid image');
  const format = meta.format as keyof typeof formats;
  // Decode and re-encode; never keep EXIF, XMP, ICC, comments or trailing bytes.
  const output = await pipeline.rotate().toFormat(format).timeout({seconds: 15}).toBuffer();
  if (output.length > MAX_IMAGE_BYTES) throw new Error('Converted image too large');
  const check = await sharp(output, {animated: true}).metadata();
  if (check.exif || check.xmp || check.icc || check.iptc) throw new Error('Metadata remains');
  return {bytes: output, extension: formats[format][0], contentType: formats[format][1]};
}
