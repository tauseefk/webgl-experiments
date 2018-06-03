export default class Lasso {
  constructor() {
    this.startPosition = {
      x: null,
      y: null
    }
    this.endPosition = {
      x: null,
      y: null
    }
    this.isMouseDown = false;
    this.mousePositions = [];
    this.closingThreshold = 0.5;
  }

  onMouseDown(posX, posY) {
    this.resetMousePositions();
    this.startPosition.x = posX;
    this.startPosition.y = posY;
    this.mousePositions.push({
      x: posX,
      y: posY
    });
    this.isMouseDown = true;
  }

  onMouseUp(posX, posY) {
    this.endPosition.x = posX;
    this.endPosition.y = posY;
    this.mousePositions.push({
      x: posX,
      y: posY
    });
    this.isMouseDown = false;
  }

  onMouseMove(posX, posY) {
    if (this.isMouseDown) {
      this.mousePositions.push({
        x: posX,
        y: posY
      });
    }
  }

  getMousePositions() {
    return this.mousePositions;
  }

  getSquareDistance(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
  }

  resetMousePositions() {
    this.mousePositions = [];
  }

  getIsMouseDown() {
    return this.isMouseDown;
  }

  getIsSelectionComplete() {
    return (this.mousePositions.length > 10
      && Math.abs(this.getSquareDistance(this.endPosition,
        this.startPosition)) < this.closingThreshold * this.closingThreshold);
  }
}
