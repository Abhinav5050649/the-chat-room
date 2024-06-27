import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { getFirestore, collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getDocs, getDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");

    const navigate = useNavigate();

    const handleSearch = async (emailQuery) => {
        setLoading(true);

        // Query the "users" collection in Firestore
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', emailQuery));

        try {
            const querySnapshot = await getDocs(userQuery);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });
            setSearchResult(results);
        } catch (error) {
            console.error('Error searching users:', error);
        }

        setLoading(false);
    };

    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.email !== user.email));
    };

    const selectedGroupHandler = (user) => {
        if (!selectedUsers.find(selectedUser => selectedUser.email === user.email)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userEmails = [];
        selectedUsers.map(user => userEmails.push(user.email));
        userEmails.push(auth.currentUser.email);

        const modelId = nanoid();
        try {
            // Create room in Firestore
            const roomRef = await addDoc(collection(db, 'rooms'), {
                room_name: roomName,
                pub_or_pri: (isPrivate) ? "private" : "public",
                admin: (isPrivate) ? auth.currentUser.email : "",
                members: (isPrivate) ? userEmails : [],
                description: roomDescription,
                room_id: roomName.trim() + "_" + modelId,
                // Add any other necessary room details
            });

            const roomId = roomName.trim() + "_" + modelId;

            if (isPrivate) {
                // Update each user's document with the new room ID
                const userUpdates = userEmails.map(async (user) => {
                    const usersCollection = collection(db, 'users');
                    const userQuery = query(usersCollection, where('email', '==', user));
                    const querySnapshot = await getDocs(userQuery);

                    const updatePromises = querySnapshot.docs.map((userDoc) => {
                        const userRef = doc(db, 'users', userDoc.id);
                        return updateDoc(userRef, {
                            private_rooms: arrayUnion(roomId)
                        });
                    });

                    await Promise.all(updatePromises);
                });

                await Promise.all(userUpdates);
            }

            const roomId_Temp = roomName.trim() + "_" + modelId;
            
            navigate(`/chat/${roomId_Temp}`);

        } catch (error) {
            console.error('Error creating room:', error);
        }
    }

    return (
        <>
            <Navbar />
            <div className="Create mt-10 px-4 md:px-0">
                <form className="max-w-sm mx-auto bg-gray-900 rounded-3xl border p-5 md:p-10">
                    <div className="mb-5">
                        <label htmlFor="roomName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Name</label>
                        <input
                            type="text"
                            id="roomName"
                            value={roomName} onChange={(e) => setRoomName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter room name"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter room description"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Is the room private?</label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="privateYes"
                                name="isPrivate"
                                value="yes"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                onChange={() => setIsPrivate(true)}
                            />
                            <label htmlFor="privateYes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="radio"
                                id="privateNo"
                                name="isPrivate"
                                value="no"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                onChange={() => setIsPrivate(false)}
                            />
                            <label htmlFor="privateNo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                        </div>
                    </div>

                    {isPrivate && (
                        <>
                            <div className="mb-5">
                                <label htmlFor="addUsers" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Users</label>
                                <input
                                    type="text"
                                    id="addUsers"
                                    placeholder="Add Users e.g., Kohli, Ganguli, Dhoni"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-1"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full flex flex-wrap mb-5">
                                {selectedUsers.map((selectedUser) => (
                                    <div key={selectedUser._id} className="bg-blue-500 text-white rounded-full px-3 py-1 m-1 cursor-pointer" onClick={() => handleDelete(selectedUser)}>
                                        {selectedUser.email}
                                    </div>
                                ))}
                            </div>
                            {loading ? (
                                <div className="text-white">Loading...</div>
                            ) : (
                                searchResult.slice(0, 4).map((user) => (
                                    <div key={user._id} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 m-1 cursor-pointer" onClick={() => selectedGroupHandler(user)}>
                                        {user.email}
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    <button
                        type="submit" onClick={handleSubmit}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default Create;
