'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Hero3DPipeline — the signature hero visual.
 *
 * A real 3D scene (raymarched signed-distance fields, perspective camera,
 * surface normals and lighting) that tells the product story in one shot:
 *
 *   soundwave bars march in from the left  →  they enter the glowing
 *   crystalline "engine" at the centre  →  finished document sheets peel
 *   out the right-hand side and drift toward the viewer.
 *
 * Rendered with additive blending so only emitted light lands on the page —
 * the dark areas stay fully transparent and the page background shows
 * through, which keeps the composite clean at any page colour.
 *
 * Degrades gracefully: no WebGL → the CSS gradient fallback underneath is
 * all you see; prefers-reduced-motion → one static frame, no animation loop;
 * scrolled out of view → the render loop pauses.
 */

const VERT = `attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_pointer;

varying vec2 v_uv;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
float sdOcta(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}

// Materials: 1 = soundwave bars, 2 = engine core, 3 = orbit rings, 4 = documents
vec2 mapScene(vec3 p) {
  vec2 res = vec2(1e5, 0.0);

  // ---- 1. Incoming soundwave: three rows of bars marching toward the core ----
  float spacing = 0.38;
  float xs = p.x - u_time * 1.25;
  float cell = floor(xs / spacing);
  float lx = xs - (cell + 0.5) * spacing;
  float zrow = clamp(floor(p.z / 0.62 + 0.5), -1.0, 1.0);
  float lz = p.z - zrow * 0.62;

  float amp = 0.20 + 0.66 * abs(sin(cell * 0.62 + zrow * 1.45))
                   * (0.72 + 0.28 * sin(cell * 0.27 + zrow));
  // fade in on the far left, absorb into the core on the right
  float env = smoothstep(-4.9, -3.6, p.x) * smoothstep(-0.95, -2.05, p.x);
  amp *= env;
  float bars = 1e5;
  if (env > 0.02) {
    bars = sdRoundBox(vec3(lx, p.y, lz), vec3(0.034, amp, 0.034), 0.026);
  }
  if (bars < res.x) res = vec2(bars, 1.0);

  // ---- 2. The engine: rotating crystalline core ----
  vec3 q = p;
  q.xz *= rot(u_time * 0.55);
  q.xy *= rot(u_time * 0.38);
  float core = sdOcta(q, 0.50 + 0.035 * sin(u_time * 3.4));
  if (core < res.x) res = vec2(core, 2.0);

  // ---- 3. Orbit rings around the engine ----
  // Both rings keep a fixed tilt and spin about Y, so neither ever presents
  // fully edge-on (an edge-on torus reads as a stray straight line).
  vec3 r1 = p; r1.yz *= rot(0.42); r1.xz *= rot(u_time * 0.30);
  vec3 r2 = p; r2.yz *= rot(1.15); r2.xz *= rot(-u_time * 0.44);
  float rings = min(sdTorus(r1, vec2(0.94, 0.017)), sdTorus(r2, vec2(1.16, 0.013)));
  if (rings < res.x) res = vec2(rings, 3.0);

  // ---- 4. Documents peeling out to the right ----
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float t = fract(u_time * 0.15 + fi * 0.25);
    float s = smoothstep(0.0, 0.17, t) * smoothstep(1.0, 0.70, t);
    if (s > 0.03) {
      vec3 dp = p - vec3(1.05 + t * 3.3, -0.5 + t * 1.45, -0.42 + fi * 0.30);
      dp.xz *= rot(-0.80 + t * 1.10 + fi * 0.55);
      dp.xy *= rot(0.13 * sin(u_time * 0.6 + fi * 1.7));
      float d = sdRoundBox(dp, vec3(0.40 * s, 0.54 * s, 0.013), 0.02);
      if (d < res.x) res = vec2(d, 4.0);
    }
  }

  return res;
}

vec3 calcNormal(vec3 p) {
  // 4-tap tetrahedral normal (cheaper than 6-tap central differences)
  vec2 k = vec2(1.0, -1.0) * 0.0015;
  return normalize(
    k.xyy * mapScene(p + k.xyy).x +
    k.yyx * mapScene(p + k.yyx).x +
    k.yxy * mapScene(p + k.yxy).x +
    k.xxx * mapScene(p + k.xxx).x
  );
}

void main() {
  vec2 uv = v_uv;
  vec2 sp = uv * 2.0 - 1.0;
  sp.x *= u_resolution.x / max(u_resolution.y, 1.0);

  // Camera — slight parallax orbit driven by the pointer.
  // The basis uses cross(fwd, worldUp) so +screen-x maps to +world-x; the
  // other handedness mirrors the scene, sending sound out the wrong side.
  float ax = u_pointer.x * 0.18;
  float ay = u_pointer.y * 0.10;
  vec3 ro = vec3(0.0, 0.60 + ay * 1.6, 5.6);
  ro.xz *= rot(ax);
  vec3 ta = vec3(0.05, 0.05, 0.0);
  vec3 fwd = normalize(ta - ro);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 rd = normalize(fwd * 2.55 + right * sp.x + up * sp.y);

  // Palette — violet/indigo engine light with a teal secondary and ivory paper
  vec3 VIOLET = vec3(0.545, 0.361, 0.965);
  vec3 INDIGO = vec3(0.404, 0.427, 0.949);
  vec3 TEAL   = vec3(0.369, 0.902, 0.831);
  vec3 IVORY  = vec3(1.000, 0.960, 0.910);

  float t = 0.35;
  float mat = 0.0;
  bool hit = false;
  float glow = 0.0;
  float beamGlow = 0.0;

  for (int i = 0; i < 72; i++) {
    vec3 pos = ro + rd * t;

    // volumetric halo around the engine
    glow += 0.0022 / (0.030 + dot(pos, pos) * 0.42);
    // energy beam feeding the engine from the soundwave side
    float beam = exp(-abs(pos.y) * 7.0) * exp(-abs(pos.z) * 7.0)
               * smoothstep(-2.4, -0.25, pos.x) * (1.0 - smoothstep(0.0, 0.40, pos.x));
    beamGlow += beam * 0.026;

    vec2 h = mapScene(pos);
    if (h.x < 0.0016) { mat = h.y; hit = true; break; }
    t += h.x * 0.85;
    if (t > 18.0) break;
  }

  vec3 col = vec3(0.0);

  if (hit) {
    vec3 pos = ro + rd * t;
    vec3 n = calcNormal(pos);
    vec3 toCore = normalize(-pos);
    float diff = max(dot(n, toCore), 0.0);
    float atten = 1.0 / (1.0 + 0.22 * dot(pos, pos));
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float key = max(dot(n, normalize(vec3(-0.4, 0.8, 0.55))), 0.0);

    if (mat < 1.5) {
      // soundwave bars — violet, lit by the engine they are heading into
      vec3 base = mix(INDIGO, VIOLET, 0.45);
      col = base * (0.22 + 1.55 * diff * atten + 0.30 * key) + TEAL * fres * 0.45;
    } else if (mat < 2.5) {
      // engine core — bright emissive crystal
      col = VIOLET * 1.55 + IVORY * 0.42 + TEAL * fres * 1.10;
    } else if (mat < 3.5) {
      // orbit rings — teal filaments
      col = TEAL * 0.95 + VIOLET * 0.35;
    } else {
      // document sheets — pale paper with softer "text" lines
      float lines = smoothstep(0.40, 0.54, fract(pos.y * 9.5 + 0.2));
      vec3 sheet = mix(vec3(0.96, 0.94, 1.00), vec3(0.46, 0.42, 0.70), lines * 0.62);
      col = sheet * (0.42 + 1.30 * diff * atten + 0.55 * key) + TEAL * fres * 0.60;
    }
  }

  // additive light: engine halo + feed beam
  col += mix(VIOLET, INDIGO, 0.35) * glow * 1.45;
  col += mix(TEAL, VIOLET, 0.45) * beamGlow;

  // soft edge falloff so the canvas melts into the page
  vec2 e = abs(uv * 2.0 - 1.0);
  float fade = (1.0 - smoothstep(0.72, 1.0, e.x)) * (1.0 - smoothstep(0.68, 1.0, e.y));
  col *= fade;

  // gentle filmic roll-off keeps the core from clipping to flat white
  col = col / (col + vec3(0.85)) * 1.32;

  // Alpha tracks emitted brightness, so unlit space stays fully transparent
  // and the page background shows through instead of a black canvas box.
  float lum = max(col.r, max(col.g, col.b));
  gl_FragColor = vec4(col, clamp(lum * 1.15, 0.0, 1.0));
}`;

export default function Hero3DPipeline({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', { alpha: true, antialias: false }) ||
      canvas.getContext('experimental-webgl', { alpha: true })) as WebGLRenderingContext | null;
    if (!gl) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cap the drawing buffer: this shader is fill-rate bound, and a hero
    // banner does not need full retina resolution.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const syncSize = () => {
      const w = Math.max(1, Math.floor((canvas.clientWidth || 1200) * dpr));
      const h = Math.max(1, Math.floor((canvas.clientHeight || 520) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    syncSize();

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uPointer = gl.getUniformLocation(program, 'u_pointer');

    // The scene is one full-screen quad, so no fragment ever overlaps another
    // and in-canvas blending is unnecessary. What matters is the canvas→page
    // composite: we clear to transparent and emit premultiplied light, so the
    // browser blends the glow straight onto the page background.
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);

    const draw = (timeSeconds: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uTime) gl.uniform1f(uTime, timeSeconds);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uPointer) gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let frame = 0;
    let visible = true;
    const loop = (ms: number) => {
      // ease the pointer parallax
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      draw(ms * 0.001);
      frame = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      draw(6.0); // one representative static frame
    } else {
      frame = requestAnimationFrame(loop);
    }

    // Pause while off-screen so the hero never burns GPU below the fold.
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const onScreen = entries[0]?.isIntersecting ?? true;
              if (onScreen === visible) return;
              visible = onScreen;
              if (reduceMotion) return;
              if (onScreen) {
                frame = requestAnimationFrame(loop);
              } else {
                cancelAnimationFrame(frame);
              }
            },
            { threshold: 0 }
          )
        : null;
    io?.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* CSS fallback / ambient bed — also what you see if WebGL is unavailable */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-mk-primary/10 blur-[70px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mk-primary/15 blur-[90px]" />
        <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-mk-teal/10 blur-[80px]" />
      </div>
      <canvas ref={canvasRef} className="relative block w-full h-full" />
    </div>
  );
}
