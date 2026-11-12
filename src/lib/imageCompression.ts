/**
 * Client-side high performance image compressor.
 * Downscales huge phone/camera photos (e.g. 4000x3000, 5-10MB) to standard web dimensions (max 1200px)
 * and compresses to modern WebP / JPEG (~60-120KB) in memory using HTML5 Canvas before uploading.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: "image/webp" | "image/jpeg";
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    format = "image/webp",
  } = options;

  // Don't compress SVGs or non-images
  if (!file.type.startsWith("image/") || file.type.includes("svg")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image with smooth bicubic scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Check if browser supports WebP canvas export
        const targetMime = format;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If compressed blob is somehow larger than original, keep original
            if (blob.size >= file.size) {
              resolve(file);
              return;
            }

            const extension = targetMime === "image/webp" ? "webp" : "jpg";
            const newName = file.name.replace(/\.[^/.]+$/, "") + `.${extension}`;

            const compressedFile = new File([blob], newName, {
              type: targetMime,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          targetMime,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
