// import sharp from 'sharp';
//
// const svg = ({ width, height, main, country, address, latitude, longitude, date }: { width: number; height: number; main: string; country: string; address: string; latitude: string; longitude: string; date: string }) => `
// <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
//   <style>
//     .title { fill: white; font-family: Arial, sans-serif; font-size: 50px; font-weight: 400; }
//     .address { fill: #eeeeee; font-family: Arial, sans-serif; font-size: 30px; }
//     .details { fill: #eeeeee; font-family: Arial, sans-serif; font-size: 28px; }
//   </style>
//
//   <rect x="0" y="0" width="${width}" height="${height}" rx="16" ry="16" fill="rgba(0,0,0,0.72)" />
//
//   <text x="40" y="70" class="title">${main}</text>
//   <text x="40" y="125" class="title">${country}</text>
//   <text x="40" y="185" class="address">${address}</text>
//   <text x="40" y="275" class="details">Lat ${latitude}° Long ${longitude}°</text>
//   <text x="40" y="315" class="details">${date}</text>
// </svg>
// `;
//
// export const addText = async ({ width, height, main, country, address, latitude, longitude, date, path }: { main: string; country: string; address: string; latitude: string; longitude: string; date: string; path: string; width: number, height: number }) => {
//   const filePath = path;
//   const image = sharp(filePath).rotate();
//   const metadata = await image.metadata();
//   const svgWidth = width - (50);
//   const svgHeight = height * 0.2;
//   const padding = 50;
//
//   const compositeLeft = padding;
//   const compositeTop = metadata.height - svgHeight - padding;
//
//   const svgBuffer = Buffer.from(svg({ width: svgWidth, height: svgHeight, main, country, address, latitude, longitude, date }));
//
//   const myArray = new Uint32Array(10);
//   const randomName = String(crypto.getRandomValues(myArray));
//   const compFile = `tempUploads/${randomName}.jpg`;
//
//   await image
//     .composite([
//       {
//         input: svgBuffer,
//         left: compositeLeft,
//         top: compositeTop,
//       },
//     ])
//     .toFile(compFile);
//
//   return compFile;
// };
//
//
//


import sharp from "sharp";
import crypto from "node:crypto";

type SvgProps = {
  width: number;
  height: number;
  main: string;
  country: string;
  addressLines: string[];
  latitude: string;
  longitude: string;
  date: string;
  padding: number;
  titleSize: number;
  addressSize: number;
  detailsSize: number;
  titleLineHeight: number;
  addressLineHeight: number;
  detailsLineHeight: number;
};

type AddTextProps = {
  main: string;
  country: string;
  address: string;
  latitude: string;
  longitude: string;
  date: string;
  path: string;
};

/**
 * Escape text before inserting it into SVG/XML.
 */
const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

/**
 * Approximate text width.
 *
 * SVG/Sharp does not give us a convenient browser-like
 * measureText() API, so this uses an approximate character
 * width multiplier.
 *
 * For Arial, ~0.52-0.58 is a reasonable approximation.
 */
const estimateTextWidth = (
  text: string,
  fontSize: number,
): number => {
  return text.length * fontSize * 0.54;
};

/**
 * Wrap text based on available width.
 */
const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
): string[] => {
  const words = text.trim().split(/\s+/);

  if (!words.length) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (
      estimateTextWidth(candidate, fontSize) <= maxWidth
    ) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    /*
     * A single word can itself be wider than the container.
     * Don't allow the line to disappear; put it on its own
     * line and let SVG handle the long word.
     */
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const createSvg = ({
  width,
  height,
  main,
  country,
  addressLines,
  latitude,
  longitude,
  date,
  padding,
  titleSize,
  addressSize,
  detailsSize,
  titleLineHeight,
  addressLineHeight,
  detailsLineHeight,
}: SvgProps): string => {
  let y = padding + titleSize;

  const titleY = y;

  y += titleLineHeight;

  const countryY = y;

  y += addressLines.length
    ? addressLineHeight
    : 0;

  const addressStartY = y;

  y += addressLines.length * addressLineHeight;

  const detailsY = y + detailsLineHeight;

  y += detailsLineHeight;

  const dateY = y + detailsLineHeight;

  const addressSvg = addressLines
    .map((line, index) => {
      const lineY =
        addressStartY +
        index * addressLineHeight;

      return `
        <text
          x="${padding}"
          y="${lineY}"
          class="address"
        >${escapeXml(line)}</text>
      `;
    })
    .join("");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      <style>
        .title {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: ${titleSize}px;
          font-weight: 600;
        }

        .address {
          fill: #eeeeee;
          font-family: Arial, sans-serif;
          font-size: ${addressSize}px;
          font-weight: 400;
        }

        .details {
          fill: #eeeeee;
          font-family: Arial, sans-serif;
          font-size: ${detailsSize}px;
          font-weight: 400;
        }
      </style>

      <rect
        x="0"
        y="0"
        width="${width}"
        height="${height}"
        rx="${padding * 0.45}"
        ry="${padding * 0.45}"
        fill="#000000"
        fill-opacity="0.72"
      />

      <text
        x="${padding}"
        y="${titleY}"
        class="title"
      >${escapeXml(main)}</text>

      <text
        x="${padding}"
        y="${countryY}"
        class="title"
      >${escapeXml(country)}</text>

      ${addressSvg}

      <text
        x="${padding}"
        y="${detailsY}"
        class="details"
      >Lat ${escapeXml(latitude)}° Long ${escapeXml(longitude)}°</text>

      <text
        x="${padding}"
        y="${dateY}"
        class="details"
      >${escapeXml(date)}</text>
    </svg>
  `;
};

export const addText = async ({
  main,
  country,
  address,
  latitude,
  longitude,
  date,
  path,
}: AddTextProps) => {
  /*
   * rotate() applies the EXIF orientation of phone photos.
   */
  const image = sharp(path).rotate();

  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Unable to determine image dimensions");
  }

  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  /*
   * Use the shortest dimension as the design scale.
   *
   * This prevents a very wide image from producing
   * ridiculously large typography.
   */
  const scale = Math.min(
    imageWidth,
    imageHeight,
  );

  /*
   * Outer margin around the overlay.
   */
  const outerMargin = Math.round(
    scale * 0.025,
  );

  /*
   * Overlay width:
   *
   * Landscape:
   *   roughly 60-70% of image width
   *
   * Portrait:
   *   roughly 90% of image width
   *
   * This makes the overlay readable on phone photos
   * without covering the entire image.
   */
  const widthRatio =
    imageWidth >= imageHeight
      ? 0.68
      : 0.9;

  const overlayWidth = Math.round(
    Math.min(
      imageWidth - outerMargin * 2,
      imageWidth * widthRatio,
    ),
  );

  /*
   * Internal padding.
   */
  const padding = Math.round(
    scale * 0.025,
  );

  /*
   * Dynamic typography.
   */
  const titleSize = Math.round(
    Math.max(
      24,
      Math.min(64, scale * 0.035),
    ),
  );

  const addressSize = Math.round(
    Math.max(
      16,
      Math.min(40, scale * 0.022),
    ),
  );

  const detailsSize = Math.round(
    Math.max(
      14,
      Math.min(34, scale * 0.019),
    ),
  );

  const titleLineHeight =
    Math.round(titleSize * 1.25);

  const addressLineHeight =
    Math.round(addressSize * 1.35);

  const detailsLineHeight =
    Math.round(detailsSize * 1.5);

  /*
   * Available width for text.
   */
  const textWidth =
    overlayWidth - padding * 2;

  /*
   * Address is the field most likely to overflow,
   * therefore wrap it before creating the SVG.
   */
  const addressLines = wrapText(
    address,
    textWidth,
    addressSize,
  );

  /*
   * Calculate overlay height from content.
   */
  const topPadding = padding;

  const titleBlock =
    titleLineHeight * 2;

  const addressBlock =
    addressLines.length *
    addressLineHeight;

  const gapAfterAddress =
    addressLines.length
      ? Math.round(padding * 0.35)
      : 0;

  const detailsBlock =
    detailsLineHeight * 2;

  const bottomPadding = padding;

  let overlayHeight =
    topPadding +
    titleBlock +
    addressBlock +
    gapAfterAddress +
    detailsBlock +
    bottomPadding;

  /*
   * Prevent the overlay from becoming absurdly large
   * when the address is extremely long.
   */
  const maxOverlayHeight = Math.round(
    imageHeight * 0.42,
  );

  overlayHeight = Math.min(
    overlayHeight,
    maxOverlayHeight,
  );

  /*
   * Bottom-right positioning.
   */
  const compositeLeft =
    imageWidth -
    overlayWidth -
    outerMargin;

  const compositeTop =
    imageHeight -
    overlayHeight -
    outerMargin;

  const svg = createSvg({
    width: overlayWidth,
    height: overlayHeight,

    main,
    country,
    addressLines,

    latitude,
    longitude,
    date,

    padding,

    titleSize,
    addressSize,
    detailsSize,

    titleLineHeight,
    addressLineHeight,
    detailsLineHeight,
  });

  const svgBuffer = Buffer.from(svg);

  /*
   * Generate a genuinely random filename.
   */
  const randomName =
    crypto.randomBytes(16).toString("hex");

  const compFile =
    `tempUploads/${randomName}.jpg`;

  await image
    .composite([
      {
        input: svgBuffer,
        left: compositeLeft,
        top: compositeTop,
      },
    ])
    .jpeg({
      quality: 92,
    })
    .toFile(compFile);

  return compFile;
};
