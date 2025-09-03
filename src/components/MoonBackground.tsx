"use client";
import { useEffect, useRef } from "react";
import { usePhase } from "../app/context/PhaseContext";
import {
  WebGLRenderer,
  Scene,
  ShaderMaterial,
  PerspectiveCamera,
  Object3D,
  Object3DEventMap,
} from "three";

export default function MoonBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moonMatRef = useRef<ShaderMaterial>(null);
  const { setPhase } = usePhase();

  const container = containerRef.current;

  useEffect(() => {
    let THREE,
      renderer: WebGLRenderer,
      scene: Scene,
      camera: PerspectiveCamera,
      moon: Object3D<Object3DEventMap>,
      animId: number;

    async function setup() {
      THREE = await import("three");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = "fixed";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.zIndex = "0";
      renderer.domElement.style.pointerEvents = "none";
      containerRef.current?.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 6;

      scene.add(new THREE.AmbientLight(0x000000, 0.7));

      const loader = new THREE.TextureLoader();
      const moonTexture = loader.load(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"
      );

      // Shader with dark side blending
      const moonMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        depthTest: true,
        uniforms: {
          uTexture: { value: moonTexture },
          uLightDir: { value: new THREE.Vector3(1, 0, -0.2) },
          uDarkColor: { value: new THREE.Color(0x030f02) },
          uDarkAlpha: { value: 0.3 },
          uGlobalAlpha: { value: 0.9 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }`,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform vec3 uLightDir;
          uniform vec3 uDarkColor;
          uniform float uDarkAlpha;
          varying vec3 vNormal;
          uniform float uGlobalAlpha;
          varying vec2 vUv;
          void main(){
            vec3 tex = texture2D(uTexture, vUv).rgb;
            float light = dot(normalize(vNormal), normalize(uLightDir));
            light = clamp(light, 0.0, 1.0);
            vec3 lit = tex * (0.4 + 1.6 * light); 
            vec3 bg = uDarkColor;  
            vec3 darkSide = mix(tex * 0.2, bg, 0.8);
            vec3 finalColor = mix(darkSide, lit, light);
            gl_FragColor = vec4(finalColor, uGlobalAlpha);
          }`,
      });
      moonMatRef.current = moonMat;

      const geometry = new THREE.SphereGeometry(2, 128, 128);
      moon = new THREE.Mesh(geometry, moonMat);
      scene.add(moon);

      // Create stars
      const starCanvas = document.createElement("canvas");
      starCanvas.width = 64;
      starCanvas.height = 64;
      const ctx = starCanvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,0.6)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.4)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const starTexture = new THREE.CanvasTexture(starCanvas);
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 1500;
      const positions = new Float32Array(starCount * 3);
      const speeds = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        positions.set([x, y, z], i * 3);
        speeds[i] = 0.0005 + Math.random() * 0.001;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      starGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

      const starMaterial = new THREE.PointsMaterial({
        map: starTexture,
        transparent: true,
        opacity: 0.6,
        size: 1.2,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // GSAP scroll phases
      const sections = document.querySelectorAll<HTMLElement>(".section");
      const total = (sections.length - 1) * window.innerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=" + total,
          scrub: true,
        },
      });

      const sectionCount = sections.length;
      const t0 = 0 / sectionCount;
      const t1 = 1 / sectionCount;
      const t2 = 2 / sectionCount;
      const t3 = 3 / sectionCount;
      const t4 = 4 / sectionCount;

      tl.to(
        moonMat.uniforms.uLightDir.value,
        { x: -1.55, y: 0, z: -0.2, duration: 1 },
        t0
      );
      tl.to(moon.rotation, { y: Math.PI * 0.5, duration: 1 }, t0);
      tl.to(
        moonMat.uniforms.uLightDir.value,
        { x: -1, y: 0, z: -0.5, duration: 1 },
        t1
      );
      tl.to(moon.rotation, { y: Math.PI * 1, duration: 1 }, t1);
      tl.to(
        moonMat.uniforms.uLightDir.value,
        { x: -0.5, y: 0, z: 0.2, duration: 1 },
        t2
      );
      tl.to(moon.rotation, { y: Math.PI * 1.5, duration: 1 }, t2);
      tl.to(
        moonMat.uniforms.uLightDir.value,
        { x: -1, y: -0.25, z: -0.75, duration: 1 },
        t3
      );
      tl.to(moon.rotation, { y: Math.PI * 2, duration: 1 }, t3);
      tl.to(
        moonMat.uniforms.uLightDir.value,
        { x: -0.7, y: 0, z: 0.3, duration: 1 },
        t4
      );
      tl.to(moon.rotation, { y: Math.PI * 2, duration: 1 }, t4);

      // Animate
      function animate() {
        animId = requestAnimationFrame(animate);
        const positions = starGeometry.attributes.position
          .array as Float32Array;
        const speeds = starGeometry.attributes.aSpeed.array as Float32Array;
        for (let i = 0; i < starCount; i++) {
          positions[i * 3 + 1] += speeds[i];
          if (positions[i * 3 + 1] > 100) positions[i * 3 + 1] = -100;
        }
        starGeometry.attributes.position.needsUpdate = true;
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
      }
      animate();

      // ✅ Fix: handle window resize
      function handleResize() {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener("resize", handleResize);
    }

    setup();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (container) container.innerHTML = "";
      window.removeEventListener("resize", () => {});
    };
  }, [container, setPhase]);

  return <div ref={containerRef} />;
}
