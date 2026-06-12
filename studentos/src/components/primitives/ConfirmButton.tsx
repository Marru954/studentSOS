"use client";

/** Two-step destructive button: first click arms it ("Confermi?"), the
 *  second within the window confirms. No modal for single local records. */
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

const DISARM_MS = 4000;

export function ConfirmButton({
  onConfirm,
  children,
  armedLabel = "Confermi?",
  size = "sm",
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  armedLabel?: string;
  size?: "sm" | "md";
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleClick() {
    clearTimeout(timer.current);
    if (armed) {
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), DISARM_MS);
  }

  return (
    <Button size={size} variant={armed ? "danger" : "ghost"} onClick={handleClick}>
      {armed ? armedLabel : children}
    </Button>
  );
}
