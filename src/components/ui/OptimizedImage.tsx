import React, { useState } from "react";
import { getOptimizedImageUrl } from "@/lib/imageMap";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallbackSrc = "/placeholder.svg",
  priority = false,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError
    ? fallbackSrc
    : getOptimizedImageUrl(src);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Sleek Skeleton Shimmer Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-secondary/80 animate-pulse z-0" />
      )}

      <img
        src={resolvedSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error - fetchPriority is supported in modern browsers
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;

