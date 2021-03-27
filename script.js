const hexToRgb = (hex) => {
  const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = regex.exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

const calculateIntermediateValue = (start, end, n, max) => {
  return Math.round(start + (n * (end - start)) / max);
};

const render = () => {
  const start = document.getElementById("start-color").value;
  const end = document.getElementById("end-color").value;
  const intermediates = document.getElementById("intermediates").valueAsNumber;

  const { r: startR, g: startG, b: startB } = hexToRgb(start);
  const { r: endR, g: endG, b: endB } = hexToRgb(end);
  const intermediateColors = Array.apply(null, Array(intermediates))
    .map((_, index) => ({
      r: calculateIntermediateValue(startR, endR, index + 1, intermediates + 1),
      g: calculateIntermediateValue(startG, endG, index + 1, intermediates + 1),
      b: calculateIntermediateValue(startB, endB, index + 1, intermediates + 1),
    }))
    .map(rgbToHex);
  document.querySelector(".start").style.backgroundColor = start;
  document.querySelector(".end").style.backgroundColor = end;
  document.querySelector(".intermediate").innerHTML = intermediateColors
    .map((color) => `<div style="background-color: ${color}"></div>`)
    .join("");
};

document
  .querySelectorAll("#start-color,#end-color,#intermediates")
  .forEach((element) => {
    element.addEventListener("change", render);
  });
window.addEventListener("load", render);
