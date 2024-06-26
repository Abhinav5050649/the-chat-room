import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { Comment } from 'react-loader-spinner';

function Landing() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    const particlesInit = useCallback(async engine => {
        console.log(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    useEffect(() => {
        
        if (!loading && user) {
            navigate("/dashboard");
        }
    }, [loading, user]);

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, new GoogleAuthProvider());
    };

    return (
        <div className="Landing min-h-screen relative">
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Comment
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="#fff"
                        backgroundColor="#221F24"
                    />
                </div>
            ) : (
                <>
                    <Particles
                        id="tsparticles"
                        init={particlesInit}
                        loaded={particlesLoaded}
                        options={{
                            background: {
                                color: {
                                    value: "#F6F1F8",
                                },
                            },
                            fpsLimit: 120,
                            interactivity: {
                                events: {
                                    onClick: {
                                        enable: true,
                                        mode: "push",
                                    },
                                    onHover: {
                                        enable: true,
                                        mode: "repulse",
                                    },
                                    resize: true,
                                },
                                modes: {
                                    push: {
                                        quantity: 4,
                                    },
                                    repulse: {
                                        distance: 200,
                                        duration: 0.4,
                                    },
                                },
                            },
                            particles: {
                                color: {
                                    value: "#221F24",
                                },
                                links: {
                                    color: "#221F24",
                                    distance: 150,
                                    enable: true,
                                    opacity: 1,
                                    width: 1,
                                },
                                move: {
                                    direction: "none",
                                    enable: true,
                                    outModes: {
                                        default: "bounce",
                                    },
                                    random: false,
                                    speed: 6,
                                    straight: false,
                                },
                                number: {
                                    density: {
                                        enable: true,
                                        area: 800,
                                    },
                                    value: 80,
                                },
                                opacity: {
                                    value: 1,
                                },
                                shape: {
                                    type: "circle",
                                },
                                size: {
                                    value: { min: 1, max: 5 },
                                },
                            },
                            detectRetina: true,
                        }}
                        className="absolute top-0 left-0 w-full h-full z-0"
                    />
                    <div className="relative z-10">
                        <Navbar />
                        <section className="bg-gray-200 bg-opacity-10 min-h-screen flex items-center">
                            <div className="grid max-w-screen-xl px-4 py-8 mx-auto gap-8 lg:py-16 lg:grid-cols-12">
                                <div className="mr-auto place-self-center lg:col-span-7">
                                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-black">The Chat Room</h1>
                                    <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-black">From community forums to private messaging, The Chat Room is the perfect tool for communication!</p>
                                    <button onClick={handleGoogleSignIn} className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                        Get started
                                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                                    <img src="https://th.bing.com/th?id=OIP.L7xhOD6veU0Iip5C2si8iQHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="mockup" className="w-full h-auto" />
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}

export default Landing;
