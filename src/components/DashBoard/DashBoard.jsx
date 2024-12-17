import React, { useEffect, useState } from 'react';
import { Search, Users, UserCheck, UserPlus, Sliders, X } from 'lucide-react';
import MembersList from '../MembersList/MembersList';

const MinimalistDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [membershipType, setMembershipType] = useState('');
    const [showList, setShowList] = useState(false);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        if (value.charAt(0) === ' ') {
            console.log(`error`);
            setSearchTerm('');
            setMembershipType('A');
            return;
        }
        setSearchTerm(value);
    };
    useEffect(() => {
        if (searchTerm === '' && membershipType === '') {
            setShowList(false);
        } else {
            setShowList(true);
        }
    }, [membershipType, searchTerm])

    const handleTypeChange = (type) => {
        setMembershipType(type);
        setSearchTerm('');
    };

    const membershipTypes = [
        {
            key: "A",
            label: "All Members",
            icon: Users,
            background: "bg-gradient-to-r from-cyan-500 to-blue-500",
            description: "View all membership types"
        },
        {
            key: "I",
            label: "Individual",
            icon: UserCheck,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "Single membership accounts"
        },
        {
            key: "F",
            label: "Family",
            icon: UserPlus,
            background: "bg-gradient-to-r from-cyan-500 to-blue-500",
            description: "Family membership accounts"
        }
    ];

    const rmvBtnCase = () => {
        setMembershipType('')
    }

    return (
        <div className="w-full h-screen bg-gray rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5 p-3">
            <div className="col-span-1 bg-gray-100 rounded-2xl p-6 h-auto">
                <div className="flex items-center mb-8">
                    <Sliders className="mr-3 text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                </div>
                <div className="space-y-4">
                    <div className="space-y-4 h-full">
                        {membershipTypes.map((type) => (
                            <div
                                key={type.key}
                                onClick={() => handleTypeChange(type.key)}
                                className={`cursor-pointer p-4 rounded-xl transition-all duration-300 ${membershipType === type.key
                                    ? `${type.background} text-white`
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <type.icon className="mr-3 w-6 h-6" />
                                    <div>
                                        <h3 className="font-semibold">{type.label}</h3>
                                        <p className={`text-sm ${membershipType === type.key ? 'text-gray-200' : 'text-gray-400'}`}>
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {membershipType && (
                        // <button className="flex justify-end mt-4 w-auto p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl hover:bg-blue-600 transition duration-300 ml-auto"
                        <button className="w-full mt-4 p-2 bg-gradient-to-r  rounded-xl from-blue-500 to-cyan-500 transition duration-300 ml-auto"
                            onClick={rmvBtnCase}>
                            CLEAR
                        </button>
                    )}
                </div>
            </div>

            <div className="col-span-4 p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Membership Management
                </h1>

                {/* Search Section */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search members by name, ID, or type"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <X
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={() => setSearchTerm('')}
                    />
                </div>

                {searchTerm && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-xl mb-6">
                        <p className="text-blue-700">
                            Searching for: <span className="font-semibold ml-2">{searchTerm}</span>
                        </p>
                    </div>
                )}

                <div>
                    {showList ? (
                        < div className="bg-gray-100 rounded-xl">
                            <MembersList
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                membershipType={membershipType}
                                setMembershipType={setMembershipType}
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center space-y-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Welcome to Your Dashboard
                            </h2>
                            <p className="text-gray-500 text-center max-w-md">
                                Your search results, book issue / return, and other activities will be displayed here. Start exploring the tools and features available to you.
                            </p>
                        </div>

                    )}
                </div>
            </div>
        </div >

    );
};

export default MinimalistDashboard;
