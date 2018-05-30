export default `
precision mediump float;

attribute vec2 aPosition;
uniform vec2 uScreenSize;

varying vec2 vUV;

void main() {
  vec2 pos = aPosition * vec2(uScreenSize.x / uScreenSize.y, 1);
  vUV = 0.5 * vec2(pos.x + 1.0, 1.0 - pos.y);
  gl_Position = vec4(aPosition, 0, 1);
}
`;
