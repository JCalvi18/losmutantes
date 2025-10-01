import React, { useState } from "react"


export function IntroSeen({ handleEnter }: { handleEnter: () => void }) {
    const [exploding, setExploding] = useState(false)
    const [showExplosion, setShowExplosion] = useState(false)

    const triggerExplosion = () => {
        if (exploding) return
        setExploding(true)
        setShowExplosion(true)
        setTimeout(() => {
            setShowExplosion(false)
            handleEnter()
        }, 900)
    }

    return (
        <>
            <style>{`
            @keyframes flash {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }

            @keyframes particle {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(cos(var(--a)) * 400px), calc(sin(var(--a)) * 400px)) scale(0);
                    opacity: 0;
                }
            }

            .explosion-flash {
                background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 200, 0, 0.8) 20%, rgba(255, 100, 0, 0) 60%);
                animation: flash 0.9s ease-out;
            }

            .explosion-particle {
                position: absolute;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: radial-gradient(circle, hsl(var(--h), 100%, 60%), hsl(var(--h), 100%, 40%));
                box-shadow: 0 0 20px hsl(var(--h), 100%, 50%);
                animation: particle 0.9s ease-out forwards;
                top: -8px;
                left: -8px;
            }
        `}</style>

            <div className="min-h-dvh w-full flex items-center justify-center bg-background relative overflow-hidden">

                <div className="relative w-[300px] sm:w-[360px] rounded-xl border bg-neutral-900 text-white shadow-2xl overflow-hidden">
                    {/* Top bar with bolts */}
                    <div className="relative h-10 bg-neutral-800 border-b flex items-center justify-between px-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true"></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse [animation-delay:200ms]"></span>
                            <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse [animation-delay:400ms]"></span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col items-center gap-5">
                        {/* Warning stripes */}
                        <div className="w-full h-10 bg-[repeating-linear-gradient(45deg,_#ef4444_0_12px,_#111_12px_24px)] rounded-md border border-red-700"></div>


                        {/* Big blinking red button */}
                        <button
                            onClick={triggerExplosion}
                            aria-label="Activate"
                            className="group relative h-28 w-28 rounded-full bg-red-600 shadow-[inset_0_-8px_16px_rgba(0,0,0,0.4),0_12px_24px_rgba(239,68,68,0.5)] ring-4 ring-red-500/40 hover:ring-red-400 focus:outline-none focus:ring-8 focus:ring-red-500/50 transition-all duration-200 disabled:opacity-60"
                            disabled={exploding}
                        >
                            <span className="absolute inset-0 rounded-full bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                            <span className="absolute -inset-2 rounded-full animate-ping bg-red-500/40"></span>
                            <span className="relative block text-sm font-bold tracking-wider">CHORRADAS</span>
                        </button>

                        {/* Safety text */}
                        <div className="text-[10px] uppercase tracking-widest text-neutral-400 text-center">
                            <p>No Presiones el Botón</p>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="h-8 bg-neutral-800 border-t flex items-center justify-center text-[10px] tracking-widest uppercase text-neutral-400">
                        <span>Modelo: SAAR-MUTANTE-25</span>
                    </div>
                </div>


                {/* Explosion overlay */}
                {showExplosion && (
                    <Explosion />
                )}
            </div>
        </>
    )
}

function Explosion() {
    const count = 28
    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 explosion-flash"></div>
            <div className="relative h-0 w-0">
                {Array.from({ length: count }).map((_, i) => {
                    const angle = (360 / count) * i + (i % 5) * 7
                    const hue = 30 + (i % 8) * 3
                    return (
                        <span
                            key={i}
                            className="explosion-particle"
                            style={{ ["--a" as string]: `${angle}deg`, ["--h" as string]: hue }}
                        />
                    )
                })}
            </div>
        </div>
    )
}
