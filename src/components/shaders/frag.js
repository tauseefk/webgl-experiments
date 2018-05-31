export default `
precision mediump float;

uniform float uBrightness;
uniform float uContrast;
uniform int uSelectionState;

uniform sampler2D uImage;
uniform sampler2D uSelection;

varying vec2 vUV;

void main() {
  gl_FragColor = texture2D(uImage, vUV) + vec4(uBrightness, uBrightness, uBrightness, 1);
  gl_FragColor = texture2D(uSelection, vUV) + vec4(uBrightness, uBrightness, uBrightness, 1);
}
`;
