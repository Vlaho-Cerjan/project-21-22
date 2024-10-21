function getSRGBValue(value: number) {
  if (value <= 0.03928) {
    return value / 12.92;
  }
  return ((value + 0.055) / 1.055) ** 2.4;
}

export function getLuminance(color: string) {
  const rgba = color.match(/\d+/g)?.map(Number);
  if (!rgba || rgba.length < 3) {
    // convert hex to rgb
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((hexData) => hexData + hexData)
        .join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rsrgb = getSRGBValue(r / 255);
    const gsrgb = getSRGBValue(g / 255);
    const bsrgb = getSRGBValue(b / 255);
    const luminance = 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
    return luminance;
  }
  const [r, g, b, a = 1] = rgba;
  const rsrgb = getSRGBValue(r || 0 / 255);
  const gsrgb = getSRGBValue(g || 0 / 255);
  const bsrgb = getSRGBValue(b || 0 / 255);
  const luminance = 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
  return luminance * a + (1 - a);
}

export default function ContrastChecker(
  foregroundColor: string,
  backgroundColor: string,
) {
  /* function getMinimumContrastRatio(
    fontSizeData: number,
    fontWeightData: number,
  ) {
    if (fontWeightData >= 0 && fontWeightData <= 0.5) {
      if (fontSizeData >= 18) {
        return 3;
      }
      return 4.5;
    }
    if (fontWeightData >= 0.6 && fontWeightData <= 0.9) {
      if (fontSizeData >= 14) {
        return 3;
      }
      if (fontSizeData >= 18) {
        return 4.5;
      }
      return 7;
    }
    if (fontWeightData >= 1 && fontWeightData <= 1.4) {
      if (fontSizeData >= 14) {
        return 4.5;
      }
      return 7;
    }
    if (fontWeightData >= 1.5 && fontWeightData <= 1.9) {
      if (fontSizeData >= 14) {
        return 4.5;
      }
      return 7;
    }
    if (fontWeightData >= 2 && fontWeightData <= 2.4) {
      if (fontSizeData >= 14) {
        return 4.5;
      }
      return 7;
    }
    if (fontSizeData >= 14) {
      return 4.5;
    }
    return 7;
  } */

  const luminance1 = getLuminance(foregroundColor);
  const luminance2 = getLuminance(backgroundColor);
  const contrastRatio =
    (Math.max(luminance1, luminance2) + 0.05) /
    (Math.min(luminance1, luminance2) + 0.05);
  const isAccessible = contrastRatio >= 4.5;
  if (isAccessible) {
    return true;
  }
  /*
  const aaLargeText = contrastRatio >= 3;
  const aaNormalText = contrastRatio >= 4.5;
  const aaaLargeText = contrastRatio >= 4.5;
  const aaaNormalText = contrastRatio >= 7;
  const failedLevels = [];

  if (!aaLargeText) {
    failedLevels.push('AA Large Text');
  }
  if (!aaNormalText) {
    failedLevels.push('AA Normal Text');
  }
  if (!aaaLargeText) {
    failedLevels.push('AAA Large Text');
  }
  if (!aaaNormalText) {
    failedLevels.push('AAA Normal Text');
  }
*/
  return false;
}
