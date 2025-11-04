import { cn } from "@/lib/utils";
import React from "react";

export default function AspectImg({ src, alt, classname }) {
  return (
    <div className={cn("aspect-square", classname)}>
      <img
        src={src}
        alt={alt || "image"}
        className="size-full object-contain"
      />
    </div>
  );
}
