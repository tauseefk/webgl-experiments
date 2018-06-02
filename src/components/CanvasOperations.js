import VERT_SRC from './shaders/vert';
import FRAG_SRC from './shaders/frag';

import DATA from './data.json';

// XXX:TODO move it to a constants file; or don't
const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

export const initImageTexture = (gl, image) => {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image);

  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
};

export const clear = (gl) => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const compileShader = (gl, type, src) => {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
};

const initRenderTexture = (gl) => {
  const rTTWidth = gl.drawingBufferWidth / DEVICE_PIXEL_RATIO;
  const rTTHeight = gl.drawingBufferHeight / DEVICE_PIXEL_RATIO;
  const rTT = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rTT);

  {
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      rTTWidth, rTTHeight, border,
      format, type, data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  return rTT;
}

var initSelectionTexture = (gl) => {
  const selectionTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, selectionTexture);

  const level = 0;
  const internalFormat = gl.LUMINANCE;
  const width = 1;
  const height = 1;
  const border = 0;
  const format = gl.LUMINANCE;
  const type = gl.UNSIGNED_BYTE;
  const data = new Uint8Array([255]);
  const alignment = 1;
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
    format, type, data);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return selectionTexture;
}

export const setupShaders = (gl) => {
  let vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  let fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);

  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  var uScreenSize = gl.getUniformLocation(program, 'uScreenSize');
  gl.uniform2f(uScreenSize, gl.drawingBufferWidth, gl.drawingBufferHeight);

  var uImage = gl.getUniformLocation(program, 'uImage');
  gl.uniform1i(uImage, 0);
  var uSelection = gl.getUniformLocation(program, 'uSelection');
  gl.uniform1i(uSelection, 1);

  // binds a vertex attribute index to a variable
  gl.bindAttribLocation(program, 0, 'uPosition');

  var buffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(DATA.positions), gl.STATIC_DRAW);

  /**
   * turns on the generic vertex attribute array
   * at the specified index into the list of attribute arrays
   */
  gl.enableVertexAttribArray(0);

  /**
   * binds the buffer currently bound to gl.ARRAY_BUFFER
   * to a generic vertex attribute of the current vertex buffer object
   * and specifies its layout
   */
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  return program;
}

const initFrameBuffer = (gl) => {
  let renderFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderFrameBuffer);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  return renderFrameBuffer;
}

export const draw = (gl, texture) => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.drawArrays(gl.TRIANGLES, 0, DATA.positions.length / 2);
}

export const drawSelectionToTexture = (gl, selectionPoints) => {
  // XXX:TODO clean this up
  let mousePositionsBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, mousePositionsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(selectionPoints), gl.STATIC_DRAW);

  gl.activeTexture(gl.TEXTURE1); // so that all changes to texture are done to the second one
  let frameBuffer = initFrameBuffer(gl);

  // connect frame buffer with render texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  var rTT = initRenderTexture(gl);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rTT, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  {
    let selectionTexture = initSelectionTexture(gl);
    gl.bindTexture(gl.TEXTURE_2D, selectionTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  }

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, selectionPoints.length / 2);
  return rTT;
}

export const drawTexture = (gl, rTT) => {
  var rectBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(DATA.positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, rTT);
  gl.drawArrays(gl.TRIANGLES, 0, DATA.positions.length / 2);
}
