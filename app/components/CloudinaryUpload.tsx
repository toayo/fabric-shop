"use client";

import { useEffect, useMemo, useState } from "react";

type CloudinaryUploadProps = {
  inputId: string;
  initialImages?: string[];
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (options: Record<string, unknown>, callback: (error: unknown, result: any) => void) => {
        open: () => void;
      };
    };
  }
}

export default function CloudinaryUpload({ inputId, initialImages = [] }: CloudinaryUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const widgetOptions = useMemo(
    () => ({
      cloudName,
      uploadPreset,
      sources: ["local", "url", "camera"],
      multiple: true,
      maxFiles: 6,
      folder: "harveys-fabrics",
    }),
    [cloudName, uploadPreset]
  );

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (input) {
      input.value = JSON.stringify(images);
    }
  }, [images, inputId]);

  useEffect(() => {
    if (document.getElementById("cloudinary-widget-script")) {
      return;
    }
    const script = document.createElement("script");
    script.id = "cloudinary-widget-script";
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openWidget = () => {
    if (!window.cloudinary || !cloudName || !uploadPreset) {
      alert("Cloudinary is not configured. Please set the env vars first.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(widgetOptions, (error, result) => {
      if (!error && result?.event === "success") {
        setImages((prev) => [...prev, result.info.secure_url]);
      }
    });
    widget.open();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openWidget}
          className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
        >
          Upload images
        </button>
        <span className="text-xs text-[var(--muted)]">
          Images are stored on Cloudinary and saved as URLs.
        </span>
      </div>
      {images.length > 0 && (
        <div className="rounded-2xl border border-theme p-3 text-xs text-[var(--muted)]">
          <p className="font-semibold text-[var(--text)]">Uploaded URLs</p>
          <ul className="mt-2 space-y-1">
            {images.map((url) => (
              <li key={url} className="flex items-center justify-between gap-2">
                <span className="truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((item) => item !== url))}
                  className="text-[var(--accent)]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <input type="hidden" id={inputId} name="images" defaultValue={JSON.stringify(initialImages)} />
    </div>
  );
}
