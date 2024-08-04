import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

const CobeGlobe = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const globeRef = useRef<any | null>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };

        window.addEventListener("resize", onResize);
        onResize(); // Initial size set

        const context = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0.8, // Adjust for a lighter base
            diffuse: 3,
            mapSamples: 16000,
            mapBrightness: 12.0, // Increase brightness to make continents stand out
            baseColor: [96 / 255, 125 / 255, 139 / 255], // Blue Gray (#607D8B)
            markerColor: [96 / 255, 125 / 255, 139 / 255], // Same color for consistency
            glowColor: [96 / 255, 125 / 255, 139 / 255], // Using primary color
            markers: [
                // Add markers here if necessary
            ],
            onRender: (state) => {
                // Continuous animation
                state.phi = phi;
                phi += 0.005; // Rotation speed
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        globeRef.current = context;

        // Fade-in effect for the globe
        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.style.opacity = "1";
            }
        }, 100);

        return () => {
            context.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            className="sm:-mt-4 -mt-16"
            style={{
                width: "100%",
                maxWidth: 400, // Reduced size
                aspectRatio: 1,
                position: "relative",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    contain: "layout paint size",
                    opacity: 0,
                    transition: "opacity 1s ease",
                }}
            />
        </div>
    );
};

export default CobeGlobe;
