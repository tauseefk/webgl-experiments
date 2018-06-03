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
  bool isPixelBlack = (selection.r == 0.0 && selection.g == 0.0 && selection.b == 0.0);
  if(!isPixelBlack) {
    if(uSelectionState == 1) {
      gl_FragColor.rgb = mix(vec3(1.0, 1.0, 1.0), color, 0.6);
    } else if(uSelectionState == 2) {
      gl_FragColor.rgb = mix(vec3(uBrightness, uBrightness, uBrightness), color, 0.6);
    }
  } else { // XXX:TODO fix this
    gl_FragColor.rgb = color + vec3(uBrightness, uBrightness, uBrightness);
  }
  gl_FragColor.a = 1.0;
}
`;
