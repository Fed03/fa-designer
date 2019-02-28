import { mouse, event } from "d3-selection";

function currentMousePosition() {
  return mouse(event.currentTarget);
}

export { currentMousePosition };
