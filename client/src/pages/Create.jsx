import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Create = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = (query) => {
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            // This is where you would normally call your search API
            const dummyResults = [
                { _id: 1, name: 'Kohli' },
                { _id: 2, name: 'Ganguly' },
                { _id: 3, name: 'Dhoni' },
                { _id: 4, name: 'Sachin' },
                { _id: 5, name: 'Dravid' }
            ];
            setSearchResult(dummyResults.filter(user => user.name.toLowerCase().includes(query.toLowerCase())));
            setLoading(false);
        }, 500);
    };

    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser._id !== user._id));
    };

    const selectedGroupHandler = (user) => {
        if (!selectedUsers.find(selectedUser => selectedUser._id === user._id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

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
                                        {selectedUser.name}
                                    </div>
                                ))}
                            </div>
                            {loading ? (
                                <div className="text-white">Loading...</div>
                            ) : (
                                searchResult.slice(0, 4).map((user) => (
                                    <div key={user._id} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 m-1 cursor-pointer" onClick={() => selectedGroupHandler(user)}>
                                        {user.name}
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    <button
                        type="submit"
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
