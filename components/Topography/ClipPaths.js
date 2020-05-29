import React from 'react'

const Rotate = ({ duration = 300, counterClockwise = false }) => (
  <animateTransform
    attributeName="transform"
    attributeType="XML"
    type="rotate"
    from="0 50 50"
    to={(counterClockwise ? -360 : 360) + ' 50 50'}
    dur={duration + 's'}
    repeatCount="indefinite"
  />
)

export default () => (
  <svg
    className="topography-clip-paths"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
    viewBox="0 0 100 100"
    style={{ position: 'absolute' }}
  >
    <defs>
      <clipPath
        id="topography-clip"
        clipPathUnits="objectBoundingBox"
        transform="scale(0.01)"
      >
        <path d="M 78.956816,94.835588 C 65.625376,103.13287 42.050856,100.43882 27.470196,93.746774 12.889014,87.054987 -0.62446252,67.284526 0.02231499,50.841644 0.6688317,34.398246 8.3427947,12.782914 22.898418,6.2004991 37.454563,-0.38191765 56.971076,-2.9578225 71.920501,4.6840516 86.869927,12.325617 96.700947,35.435522 99.522777,51.125185 102.3446,66.814332 92.288777,86.538361 78.957336,94.83564 Z" />
      </clipPath>
      <clipPath
        id="topography-clip--rotating"
        clipPathUnits="objectBoundingBox"
        transform="scale(0.01)"
      >
        >
        <path d="M 13.583772,34.022893 C 15.730624,24.49307 22.179354,16.864606 30.03035,10.944567 37.881346,5.0245281 48.993802,1.8690795 58.770027,3.7018823 c 9.776226,1.8328028 17.246626,10.1211807 23.49314,18.1992497 6.246514,8.078069 9.424031,13.365263 9.77129,23.502532 0.347259,10.13727 -4.851834,17.107515 -9.752113,25.364993 C 77.382066,79.026134 68.044786,87.92315 58.355802,90.61286 48.666818,93.30257 37.636287,85.816756 28.619141,80.795314 19.601994,75.773871 10.007163,72.889818 7.5547617,63.443123 5.1023609,53.996428 11.43692,43.552716 13.583772,34.022893 Z">
          <Rotate />
        </path>
      </clipPath>
    </defs>
  </svg>
)
