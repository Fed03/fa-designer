import React, { Component } from "react";

class Background extends Component {
  render() {
    const size = 40960;
    const patternSize = 30;
    const gridDotSize = 2;
    return (
      <g>
        <defs>
          <pattern
            id="circles"
            height={patternSize}
            width={patternSize}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={patternSize / 2}
              cy={patternSize / 2}
              r={gridDotSize}
              fill="#bbb"
            />
          </pattern>
        </defs>
        <rect
          x={-(size / 4)}
          y={-(size / 4)}
          width={size}
          height={size}
          fill="url('#circles')"
        />
      </g>
    );
  }
}

export default Background;
