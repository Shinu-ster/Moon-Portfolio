"use client";
import { useEffect, useRef } from "react";
import { usePhase } from "../app/context/PhaseContext";
import { WebGLRenderer } from "three";
import { Scene } from "three";
import { PerspectiveCamera } from "three";
import { Object3D, Object3DEventMap } from "three";

export default function MoonBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moonMatRef = useRef<any>(null);
  const { setPhase } = usePhase();

  useEffect(() => {
    let THREE: any,
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
      renderer.setClearColor(0x000000,0);
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

      // Shader with dark side blending to rgba(0,0,0,0.3)
      const moonMat = new THREE.ShaderMaterial({
        transparent:true,
        uniforms: {
          uTexture: { value: moonTexture },
          uLightDir: { value: new THREE.Vector3(1, 0, 0) }, // waxing crescent: light from right → C shape
          uDarkColor: { value: new THREE.Color(0x030f02) },
          uDarkAlpha: { value: 0.3 },
          uGlobalAlpha: { value: 0.9},
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

          // brighten lit side: add + scale
          vec3 lit = tex * (0.4 + 1.6 * light); 
          

          // Dark side blends with background
          vec3 bg = uDarkColor;  
          vec3 darkSide = mix(tex * 0.2, bg, 0.8); // force darker shadows

          // Mix lit & dark sides
          vec3 finalColor = mix(darkSide, lit, light);

          gl_FragColor = vec4(finalColor, uGlobalAlpha);
        }


`,
      });
      moonMatRef.current = moonMat;

      const geometry = new THREE.SphereGeometry(2, 128, 128);
      moon = new THREE.Mesh(geometry, moonMat);
      scene.add(moon);

      // GSAP Scroll phases
      const sections = document.querySelectorAll<HTMLElement>(".section");
      const total = (sections.length - 1) * window.innerHeight;
      const t1 = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=" + total,
          scrub: true,
        },
      });

      // Phase transitions (scroll → light direction & rotation)
      t1.to(
        moonMat.uniforms.uLightDir.value,
        {
          x: 0,
          y: 0,
          z: -0.5,
          duration: 1,
          onUpdate: () => setPhase("waxing-crescent"),
        },
        0
      );
      t1.to(moon.rotation, { y: Math.PI * 0.5, duration: 1 }, 0);

      t1.to(
        moonMat.uniforms.uLightDir.value,
        {
          x: 0,
          y: 0,
          z: -1,
          duration: 1,
          onUpdate: () => setPhase("full-moon"),
        },
        1
      );
      t1.to(moon.rotation, { y: Math.PI * 0.5, duration: 1 }, 1);

      t1.to(
        moonMat.uniforms.uLightDir.value,
        {
          x: -1,
          y: -0.5,
          z: -1,
          duration: 1,
          onUpdate: () => setPhase("waning"),
        },
        2
      );
      t1.to(moon.rotation, { y: Math.PI * 1, duration: 1 }, 2);

      // Animate loop (no idle spin, just render)
      function animate() {
        animId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    }

    setup();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [setPhase]);

  return <div ref={containerRef} />;
}
