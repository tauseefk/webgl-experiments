export default `
precision mediump float;

attribute vec2 aPosition;
attribute vec2 aSelectionCoords;

uniform vec2 uScreenSize;

varying vec2 vUV;
varying vec2 vSelectionCoords;

void main() {
  vUV = aPosition;
  vSelectionCoords = aSelectionCoords;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
