export default `
precision mediump float;

uniform sampler2D uImage;

varying vec2 vUV;

void main() {
  gl_FragColor = texture2D(uImage, vUV);
}
`;
