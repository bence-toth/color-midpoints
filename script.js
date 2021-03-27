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

const calculateMidpointValue = (start, end, n, max) =>
  Math.round(start + (n * (end - start)) / max);

const isMobileQuery = "(max-width: 720px)";

const elements = {
  main: document.querySelector("main"),

  midpointsWrapper: document.querySelector(".midpoints"),
  numberOfMidpointsInput: document.getElementById("midpoints"),
  numberOfColors: document.getElementById("number-of-colors"),

  startWrapper: document.querySelector(".start"),
  startColorInput: document.getElementById("start-color"),
  startColorCode: document.querySelector(".start .color-code"),

  endWrapper: document.querySelector(".end"),
  endColorInput: document.getElementById("end-color"),
  endColorCode: document.querySelector(".end .color-code"),
};

const generateMidpointColorMarkup = (color) =>
  `<div style="background-color: ${color}">
    <div class="color-code">${color}</div>
  </div>`;

const updateMarkup = ({ startColor, endColor, midpointColors }) => {
  // Update number of colors
  elements.numberOfColors.innerText = midpointColors.length + 2;

  // Set layout
  const isMobile = window.matchMedia(isMobileQuery).matches;
  elements.main.style[isMobile ? "gridTemplateColumns" : "gridTemplateRows"] =
    "1fr";
  elements.main.style[
    isMobile ? "gridTemplateRows" : "gridTemplateColumns"
  ] = `1fr ${midpointColors.length}fr 1fr`;
  elements.midpointsWrapper.style.gridAutoFlow = isMobile ? "row" : "column";

  // Set colors and color codes
  elements.startWrapper.style.backgroundColor = startColor;
  elements.startColorCode.innerText = startColor;
  elements.midpointsWrapper.innerHTML = midpointColors
    .map(generateMidpointColorMarkup)
    .join("");
  elements.endWrapper.style.backgroundColor = endColor;
  elements.endColorCode.innerText = endColor;
};

const render = () => {
  // Get data from inputs
  const startColor = elements.startColorInput.value;
  const endColor = elements.endColorInput.value;
  const midpoints = elements.numberOfMidpointsInput.valueAsNumber;

  // Calculate midpoint colors
  const { r: startR, g: startG, b: startB } = hexToRgb(startColor);
  const { r: endR, g: endG, b: endB } = hexToRgb(endColor);
  const midpointColors = Array.apply(null, Array(midpoints))
    .map((_, index) => ({
      r: calculateMidpointValue(startR, endR, index + 1, midpoints + 1),
      g: calculateMidpointValue(startG, endG, index + 1, midpoints + 1),
      b: calculateMidpointValue(startB, endB, index + 1, midpoints + 1),
    }))
    .map(rgbToHex);

  // Update markup
  updateMarkup({ startColor, endColor, midpointColors });
};

const setupEventListeners = () => {
  // On inputs change
  document
    .querySelectorAll("#start-color,#end-color,#midpoints")
    .forEach((element) => {
      element.addEventListener("change", render);
    });

  // On resize (when switching between mobile and desktop)
  let wasMobile = window.matchMedia(isMobileQuery).matches;
  window.addEventListener("resize", () => {
    const isMobile = window.matchMedia(isMobileQuery).matches;
    if (wasMobile !== isMobile) {
      wasMobile = isMobile;
      render();
    }
  });

  // On page load
  window.addEventListener("load", render);
};

setupEventListeners();
