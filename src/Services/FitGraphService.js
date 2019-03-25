import { zoomIdentity } from "d3-zoom";

class FitGraphService {
  constructor(minZoom, maxZoom) {
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
  }

  fitIntoBox(boxToFit, parentBox) {
    const transformDefinition = {
      x: 0,
      y: 0,
      k: 1
    };
    if (this.boxContainsSomething(boxToFit)) {
      transformDefinition.k = this.calcNextK(boxToFit, parentBox);

      const whatToFitCenter = this.getBoxCenter(boxToFit);
      const boxCenter = this.getBoxCenter(parentBox);

      transformDefinition.x =
        boxCenter.x - whatToFitCenter.x * transformDefinition.k;

      transformDefinition.y =
        boxCenter.y - whatToFitCenter.y * transformDefinition.k;
    }

    return zoomIdentity
      .translate(transformDefinition.x, transformDefinition.y)
      .scale(transformDefinition.k);
  }

  boxContainsSomething(box) {
    return box.width > 0 && box.height > 0;
  }

  getBoxCenter(box) {
    return {
      x: (box.x || 0) + box.width / 2,
      y: (box.y || 0) + box.height / 2
    };
  }

  calcNextK(boxToFit, parentBox) {
    const { height: parentH, width: parentW } = parentBox;
    const { height: boxH, width: boxW } = boxToFit;

    const nextK = 0.95 / Math.max(boxW / parentW, boxH / parentH);

    if (nextK < this.minZoom) {
      return this.minZoom;
    } else if (nextK > this.maxZoom) {
      return this.maxZoom;
    }
    return nextK;
  }
}

export { FitGraphService };
