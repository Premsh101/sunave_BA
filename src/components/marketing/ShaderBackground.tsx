'use client';

import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= u_resolution.x / u_resolution.y;

    // Moving horizontal lines (sound waves)
    float wave = 0.0;
    for(float i = 1.0; i < 6.0; i++) {
        float speed = i * 0.2;
        float freq = i * 2.5;
        float amp = 0.05 / i;
        float yOffset = sin(uv.x * freq + u_time * speed) * amp;
        float line = smoothstep(0.005, 0.0, abs(uv.y - (0.3 + i * 0.1) + yOffset));
        wave += line * (1.0 - i * 0.15);
    }

    // Radial glow in center
    float dist = length(p);
    float glow = exp(-dist * 2.5) * 0.3;

    // Particles converting into documents
    float particles = 0.0;
    for(float i = 0.0; i < 20.0; i++) {
        float h = hash(vec2(i, 123.0));
        float t = fract(u_time * 0.2 + h);
        vec2 pos = vec2(cos(h * 6.28), sin(h * 6.28)) * t * 1.5;
        float pSize = 0.003 * (1.0 - t);
        particles += smoothstep(pSize, 0.0, length(p - pos));
    }

    vec3 bg = vec3(0.02, 0.03, 0.06);
    vec3 accent = vec3(0.42, 0.45, 0.95);
    vec3 secondary = vec3(0.3, 0.8, 0.7);

    vec3 color = mix(bg, accent, wave * 0.4);
    color += accent * glow;
    color = mix(color, secondary, particles * 0.5);

    gl_FragColor = vec4(color, 1.0);
}`;

/**
 * Fixed full-viewport WebGL "sound waves distilling into documents" shader
 * from the Stitch home design. Renders behind the page (z-index -1) and
 * degrades gracefully (plain obsidian background) when WebGL is unavailable.
 */
export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    resizeObserver?.observe(canvas);
    syncSize();

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    let frame = 0;
    const render = (t: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-mk-bg">
      <canvas ref={canvasRef} className="block w-full h-full opacity-80" />
    </div>
  );
}
