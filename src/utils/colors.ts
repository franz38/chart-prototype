import { hsla, parseToRgba, rgba, toHex, toHsla } from "color2k";

export const randomColor = (): string => {
  return toHex(
    rgba(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1),
  );
};

export const randomNiceColor = (): string => {
  return toHex(
    hsla(
      Math.random() * 360,
      0.25 + Math.random() * 0.75,
      0.25 + Math.random() * 0.75,
      1,
    ),
  );
};

export const getOpacity = (colorString: string) => {
  try {
    const opacity = Math.ceil(parseToRgba(colorString)[3] * 100);
    return `${opacity}%`;
  } catch (err) {
    return `100%`;
  }
};

export const getComplementary = (colorString: string) => {
  const values = toHsla(colorString)
    .replace("hsla", "")
    .replace("(", "")
    .replace(")", "")
    .split(",");
  let newAngle = +values[0] - 180;
  if (newAngle < 0) newAngle += 360;
  const complementary = `hsla(${newAngle}, ${values[1]}, ${values[2]}, ${values[3]})`;
  return toHex(complementary);
};
