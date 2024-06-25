import React, { useCallback, useState, useEffect } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, addDoc, collection, serverTimestamp, doc, where, getDocs, QuerySnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

function Dashboard() {
    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);

    const toggleDropdown1 = () => setDropdown1Open(!dropdown1Open);
    const toggleDropdown2 = () => setDropdown2Open(!dropdown2Open);

    const { uid, displayName, photoURL, email } = auth.currentUser;

    const [listOfPublicRooms, setListOfPublicRooms] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [listOfPrivateRooms, setListOfPrivateRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "rooms"));
                let rooms = querySnapshot.docs.map(doc => doc.data());
                rooms = rooms.filter(room => room.pub_or_pri === "public");
                setListOfPublicRooms(rooms);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const getPrivateRooms = async (privateRooms) => {
            try {
                const roomPromises = privateRooms.map(async (roomId) => {
                    const docRef = doc(db, "rooms", roomId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        return docSnap.data();
                    } else {
                        console.error("No such document: ", roomId);
                    }
                });

                const rooms = await Promise.all(roomPromises);
                setListOfPrivateRooms(rooms.filter(room => room !== undefined));
            } catch (error) {
                console.error("Error fetching private rooms: ", error);
            }
        };

        const createUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userDetails = querySnapshot.docs.map(doc => doc.data()).filter(user => user.email === email);

                if (userDetails == null || userDetails.length === 0) {
                    const docRef = await addDoc(collection(db, "users"), {
                        email,
                        private_rooms: []
                    });

                    const newUser = {
                        id: docRef.id,
                        email,
                        private_rooms: []
                    };

                    setCurrentUser(newUser);
                    console.log("Document written with ID: ", docRef.id);
                    await getPrivateRooms(newUser.private_rooms);
                } else {
                    console.log("User already exists");
                    const existingUser = userDetails[0];
                    setCurrentUser(existingUser);
                    await getPrivateRooms(existingUser.private_rooms);
                }
            } catch (error) {
                console.error("Error creating user: ", error);
            }
        };

        createUser();
    }, [email]);

    return (
        <div className="relative min-h-screen">
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
            <div className="relative z-10 w-full">
                <Navbar />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="mb-8 text-3xl font-bold text-center">Chat Rooms</h1>
                <div className="flex space-x-4">
                    <div className="relative inline-block text-left">
                        <button
                            id="dropdownButton1"
                            onClick={toggleDropdown1}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                            type="button"
                        >
                            Public Rooms
                            <svg
                                className="w-2.5 h-2.5 ml-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        {dropdown1Open && (
                            <div
                                id="dropdown1"
                                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow absolute mt-2 w-full max-w-[200px]"
                            >
                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownButton1">
                                    {(listOfPublicRooms.length !== 0) ? listOfPublicRooms.map((room) => (
                                        <li key={room.room_id}>
                                            <Link
                                                to={{ pathname: `/chat/${room.room_id}`}}
                                                className="block px-4 py-2 text-black hover:bg-gray-100 truncate"
                                            >
                                                {room.room_name}
                                            </Link>
                                        </li>
                                    )) : (
                                        <li>
                                            <p className="block px-4 py-2 text-black">No public rooms</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="relative inline-block text-left">
                        <button
                            id="dropdownButton2"
                            onClick={toggleDropdown2}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                            type="button"
                        >
                            Your Private Rooms
                            <svg
                                className="w-2.5 h-2.5 ml-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        {dropdown2Open && (
                            <div
                                id="dropdown1"
                                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute mt-2"
                            >
                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownButton1">
                                    {(listOfPrivateRooms.length !== 0) ? listOfPrivateRooms.map((room) => (
                                        <li key={room.room_id}>
                                            <Link
                                                to={{ pathname: `/chat/${room.room_id}`}}
                                                className="block px-4 py-2 text-black hover:bg-gray-100"
                                            >
                                                {room.room_name}
                                            </Link>
                                        </li>
                                    )) : (
                                        <li>
                                            <p className="block px-4 py-2 text-black">No private rooms</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
