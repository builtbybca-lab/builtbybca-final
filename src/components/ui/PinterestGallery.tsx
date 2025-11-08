import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinterestGalleryProps {
  images: string[];
  className?: string;
}

export const PinterestGallery = ({ images, className = "" }: PinterestGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No images available yet.</p>
      </div>
    );
  }

  const openImage = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  return (
    <>
      <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden rounded-lg"
            onClick={() => openImage(image, index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={closeImage}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-0">
          <div className="relative flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={closeImage}
            >
              <X className="w-5 h-5" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  className="absolute left-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  className="absolute right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  Next
                </Button>
              </>
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-[95vh] object-contain rounded-lg"
              />
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
