"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function About() {
  const router = useRouter();
  const { theme } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    // No background - transparent
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 3, 0); // Side view position

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.target.set(0, 0, 0); // Look at center of model

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Add a point light for extra illumination
    const pointLight = new THREE.PointLight(0x3498db, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      "/airinvst2.glb",
      (gltf) => {
        const model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Scale the model to fit nicely
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDim;
        model.scale.setScalar(scale);

        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      sceneRef.current = { scene, camera, renderer, controls, animationId };
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/assets/photos/${
              theme === "night" ? "CityNight.jpg" : "Daylight.jpg"
            }')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[8px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          {/* Title */}
          <h1
            className="text-6xl font-bold text-white text-center mb-12"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            Air Invest
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Overview */}
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-green-400 mb-6">
                Overview
              </h2>
              <p className="text-white text-lg leading-relaxed mb-8">
                Here at AirInvest we provide users with the opportunity to
                explore and analyze real estate investment opportunities. Users
                can access live property data from Airbnb and Zillow APIs,
                investment metrics, and make informed decisions about both
                traditional real estate and short-term rental investments
                through an intuitive web interface.
              </p>

              <h3 className="text-2xl font-bold text-green-400 mb-4">
                Features
              </h3>
              <ul className="text-white space-y-2 text-lg">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>React.js</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Amazon Web Services (AWS) hosting</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Airbnb Scraper</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Zillow Scrapper</span>
                </li>
              </ul>
            </div>

            {/* Right Column - 3D Model */}
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-gray-700 h-[500px]">
              <div
                ref={mountRef}
                className="w-full h-full rounded-lg overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
