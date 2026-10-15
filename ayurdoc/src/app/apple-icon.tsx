import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brandMark";

// Served at /apple-icon — iPhone "Add to Home Screen" icon
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={180} />, size);
}
