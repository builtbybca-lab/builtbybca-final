import React from 'react';

const CircuitBoardBackground = () => {
    // Define the distinct "Corner" pattern once.
    // This pattern conceptually sits in the Top-Left.
    // We will mirror it to other corners.
    const CircuitCorner = () => (
        <React.Fragment>
            <defs>
                <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--bca-red))" stopOpacity="1" />
                    <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Traces entering from Left Edge */}
            <g stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" className="animate-circuit-draw">
                <path d="M0,100 H50 V150 H100" />
                <path d="M0,200 H80 V250 H150" />
                <path d="M0,320 H120 V250 H200" />
                <path d="M0,450 H60 V400 H120" />
            </g>

            {/* Traces entering from Top Edge */}
            <g stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" className="animate-circuit-draw">
                <path d="M150,0 V60 H200 V100" />
                <path d="M350,0 V40 H300 V120" />
                <path d="M550,0 V90 H500 V150" />
            </g>

            {/* Electrons (Red Dashes) */}
            <g stroke="hsl(var(--bca-red))" strokeWidth="2" fill="none" className="animate-electron-flow" strokeDasharray="30 400">
                <path d="M0,100 H50 V150 H100" />
                <path d="M0,320 H120 V250 H200" />
                <path d="M0,450 H60 V400 H120" />
                <path d="M150,0 V60 H200 V100" />
                <path d="M550,0 V90 H500 V150" />
            </g>

            {/* Nodes (Red Dots) */}
            <g fill="hsl(var(--bca-red))">
                <circle cx="100" cy="150" r="3" />
                <circle cx="150" cy="250" r="3" />
                <circle cx="200" cy="250" r="3" />
                <circle cx="120" cy="400" r="3" />
                <circle cx="200" cy="100" r="3" />
                <circle cx="300" cy="120" r="3" />
                <circle cx="500" cy="150" r="3" />
            </g>
        </React.Fragment>
    );

    return (
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none select-none overflow-hidden">
            {/* Top Left */}
            <svg className="absolute left-0 top-0 w-[50vw] h-[50vh] overflow-visible">
                <CircuitCorner />
            </svg>

            {/* Top Right (Flipped X) */}
            <svg className="absolute right-0 top-0 w-[50vw] h-[50vh] overflow-visible" style={{ transform: 'scaleX(-1)' }}>
                <CircuitCorner />
            </svg>

            {/* Bottom Left (Flipped Y) */}
            <svg className="absolute left-0 bottom-0 w-[50vw] h-[50vh] overflow-visible" style={{ transform: 'scaleY(-1)' }}>
                <CircuitCorner />
            </svg>

            {/* Bottom Right (Flipped X & Y) */}
            <svg className="absolute right-0 bottom-0 w-[50vw] h-[50vh] overflow-visible" style={{ transform: 'scale(-1, -1)' }}>
                <CircuitCorner />
            </svg>
        </div>
    );
};

export default CircuitBoardBackground;
