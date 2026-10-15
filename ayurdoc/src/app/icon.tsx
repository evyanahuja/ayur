import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brandMark";

// Served at /icon — 512x512 PNG used by browsers, the manifest and Google results
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={512} />, size);
}
