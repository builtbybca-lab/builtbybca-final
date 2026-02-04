import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsInView(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isInView };
};

// Component wrapper for scroll animations
import React from 'react';

interface ScrollAnimateProps {
    children: React.ReactNode;
    animation?: 'fade' | 'slide-left' | 'slide-right' | 'scale';
    delay?: number;
    className?: string;
    threshold?: number;
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
    children,
    animation = 'fade',
    delay = 0,
    className = '',
    threshold = 0.1,
}) => {
    const { ref, isInView } = useScrollAnimation({ threshold });

    const animationClass = {
        fade: 'scroll-animate',
        'slide-left': 'scroll-slide-left',
        'slide-right': 'scroll-slide-right',
        scale: 'scroll-scale',
    }[animation];

    return (
        <div
            ref={ref}
            className={`${animationClass} ${isInView ? 'in-view' : ''} ${className}`}
            style={{ animationDelay: delay ? `${delay}s` : undefined }}
        >
            {children}
        </div>
    );
};

export default ScrollAnimate;
