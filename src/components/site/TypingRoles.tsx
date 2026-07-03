"use client";

import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Software Engineer",
  ".NET Backend Engineer",
  "React, Next.js & Angular Developer",
  "Scalable API Architect",
  "System Design Enthusiast",
  "Cloud & DevOps Enthusiast",
  "Performance-Focused Developer",
  "Problem Solver",
];

export function TypingRoles() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = roles[i];
    const speed = del ? 40 : 80;
    const t = setTimeout(() => {
      if (!del && text === current) {
        setTimeout(() => setDel(true), 1400);
        return;
      }
      if (del && text === "") {
        setDel(false);
        setI((v) => (v + 1) % roles.length);
        return;
      }
      setText(del ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <span className="font-mono text-primary">
      {text}
      <span className="caret-blink">|</span>
    </span>
  );
}
