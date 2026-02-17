"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  ariaHidden?: boolean;
  scoped?: boolean;
};

export default function DottedSurface({ className = "", ariaHidden = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // initial size (use container sizing so surface can be scoped)
    const rect = container.getBoundingClientRect();
    let width = Math.max(1, Math.floor(rect.width));
    let height = Math.max(1, Math.floor(rect.height));

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    if (className) renderer.domElement.className = className;

    // place canvas
    container.appendChild(renderer.domElement);

    // Create particle geometry
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const gridSize = Math.ceil(Math.sqrt(particleCount));
    const spacing = 2.5;

    for (let i = 0; i < particleCount; i++) {
      const x = (i % gridSize) * spacing - (gridSize * spacing) / 2;
      const z = Math.floor(i / gridSize) * spacing - (gridSize * spacing) / 2;
      const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorMix = (i / particleCount) * 0.5 + 0.5;
      colors[i * 3] = (201 * (1 - colorMix) + 124 * colorMix) / 255;
      colors[i * 3 + 1] = (169 * (1 - colorMix) + 58 * colorMix) / 255;
      colors[i * 3 + 2] = (97 * (1 - colorMix) + 237 * colorMix) / 255;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const positionAttribute = geometry.getAttribute("position");

      for (let i = 0; i < particleCount; i++) {
        const x = positionAttribute.getX(i);
        const z = positionAttribute.getZ(i);
        const y = Math.sin(x * 0.1 + elapsedTime * 0.25) * Math.cos(z * 0.1 + elapsedTime * 0.18) * 2;
        positionAttribute.setY(i, y);
      }

      positionAttribute.needsUpdate = true;

      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    }

    animate();

    // ResizeObserver to keep canvas sized to container
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = Math.max(1, Math.floor(cr.width));
        const h = Math.max(1, Math.floor(cr.height));
        if (w === width && h === height) return;
        width = w;
        height = h;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
      }
    });
    ro.observe(container);

    // Cleanup
    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      // remove children from scene to avoid leaks
      scene.clear();
    };
  }, [className]);

  return (
    <div
      ref={containerRef}
      aria-hidden={ariaHidden}
      className={`pointer-events-none absolute inset-0 h-full w-full ${""}`}
    />
  );
}
