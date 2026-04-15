"use client";

import React from "react";
import { FaPlay } from "react-icons/fa";

interface WelcomeScreenProps {
  onStart: () => void;
}

/**
 * WelcomeScreen Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="page-container">
      <div className="card-container">
        <div className="icon-box-lg">
          <span className="text-primary-foreground text-4xl font-black">
            POS
          </span>
        </div>

        <h1 className="hero-title">Simple POS</h1>

        <p className="hero-subtitle">
          A modern, lightweight point of sale system designed for performance
          and simplicity.
        </p>

        <button onClick={onStart} className="btn-hero">
          <div className="from-primary absolute inset-0 h-full w-full bg-gradient-to-r to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center justify-center gap-3">
            Start Setup
            <FaPlay className="text-sm transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>

      <p className="meta-text">v0.2.0 • Built with Tauri v2 & Next.js 16</p>
    </div>
  );
}
