import React from "react";

export const IMAGE = "https://i.imgur.com/OCyjHNF.jpg";

export const IMAGE_STYLES = { width: 500, height: 500 };

export const SWATCHES_STYLES = {
  marginTop: 20,
  marginBottom:20,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export const renderSwatches = (type, colors) => {
  console.log(colors)
  return colors.map((color, id) => {
    return (
      <div
        key={id++}
        style={{
          backgroundColor:
            Array.isArray(color) && type === "rgb"
              ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
              : color,
          width: 100,
          height: 50,
          fontSize: 8,
          margin: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex"
        }}>
          {/* {color} */}
      </div>
    );
  });
};

export const Swatches = props => (
  <div style={SWATCHES_STYLES}>{props.renderSwatches("rgb", props.colors)}</div>
);