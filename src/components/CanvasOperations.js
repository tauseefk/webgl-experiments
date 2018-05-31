import VERT_SRC from './shaders/vert';
import FRAG_SRC from './shaders/frag';

import DATA from './data.json';

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
  gl.clearColor(1, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const compileShader = (gl, type, src) => {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
};

export const setupShaders = (gl) => {
  let vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  let fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);

  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.bindAttribLocation(program, 0, 'uPosition');

  gl.linkProgram(program);
  gl.useProgram(program);

  var uScreenSize = gl.getUniformLocation(program, 'uScreenSize');
  gl.uniform2f(uScreenSize, gl.drawingBufferWidth, gl.drawingBufferHeight);

  var uImage = gl.getUniformLocation(program, 'uImage');
  gl.uniform1i(uImage, 0);

  var buffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(DATA.positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  return program;
}

export const draw = (gl, texture) => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.drawArrays(gl.TRIANGLES, 0, DATA.positions.length / 2);
}
