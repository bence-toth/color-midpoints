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

const calculateMidpointValue = (start, end, n, max) => {
  return Math.round(start + (n * (end - start)) / max);
};

const render = () => {
  const start = document.getElementById("start-color").value;
  const end = document.getElementById("end-color").value;
  const midpoints = document.getElementById("midpoints").valueAsNumber;

  const { r: startR, g: startG, b: startB } = hexToRgb(start);
  const { r: endR, g: endG, b: endB } = hexToRgb(end);
  const midpointColors = Array.apply(null, Array(midpoints))
    .map((_, index) => ({
      r: calculateMidpointValue(startR, endR, index + 1, midpoints + 1),
      g: calculateMidpointValue(startG, endG, index + 1, midpoints + 1),
      b: calculateMidpointValue(startB, endB, index + 1, midpoints + 1),
    }))
    .map(rgbToHex);
  document.querySelector(".start").style.backgroundColor = start;
  document.querySelector(".end").style.backgroundColor = end;
  document.querySelector(".start .color-code").innerText = start;
  document.querySelector(".end .color-code").innerText = end;
  document.querySelector(".midpoints").innerHTML = midpointColors
    .map(
      (color) =>
        `<div style="background-color: ${color}">
          <div class="color-code">${color}</div>
        </div>`
    )
    .join("");
  if (window.matchMedia("(max-width: 720px)").matches) {
    document.querySelector("main").style.gridTemplateColumns = `1fr`;
    document.querySelector(
      "main"
    ).style.gridTemplateRows = `1fr ${midpoints}fr 1fr`;
    document.querySelector(".midpoints").style.gridAutoFlow = "row";
  } else {
    document.querySelector("main").style.gridTemplateRows = `1fr`;
    document.querySelector(
      "main"
    ).style.gridTemplateColumns = `1fr ${midpoints}fr 1fr`;
    document.querySelector(".midpoints").style.gridAutoFlow = "column";
  }

  document.getElementById("number-of-colors").innerText = midpoints;
};

document
  .querySelectorAll("#start-color,#end-color,#midpoints")
  .forEach((element) => {
    element.addEventListener("change", render);
  });
window.addEventListener("load", render);

let wasMobile = window.matchMedia("(max-width: 720px)").matches;
window.addEventListener("resize", () => {
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  if (wasMobile !== isMobile) {
    wasMobile = isMobile;
    render();
  }
});
