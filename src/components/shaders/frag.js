export default `
precision mediump float;

uniform float uBrightness;
uniform float uContrast;
uniform int uSelectionState;

uniform sampler2D uImage;
uniform sampler2D uSelection; // XXX:TODO this is the selection texture; facepalm..

varying vec2 vUV;
varying vec2 vSelectionCoords;

void main() {
  vec3 color = texture2D(uImage, vUV).rgb;
  vec3 selection = texture2D(uSelection, vSelectionCoords).rgb;
  if(selection.r != 1.0) {
    gl_FragColor.rgb = mix(selection, color, 0.6);
  } else { // XXX:TODO fix this
    gl_FragColor = texture2D(uImage, vUV) + vec4(uBrightness, uBrightness, uBrightness, 1);
  }
  gl_FragColor.a = 1.0;
}
`;
