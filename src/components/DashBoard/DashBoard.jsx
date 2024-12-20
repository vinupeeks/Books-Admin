import React, { useEffect, useState } from 'react';
import { Search, Users, UserCheck, UserPlus, Sliders, X } from 'lucide-react';
import MembersList from '../MembersList/MembersList';
import SideMenu from '../navbar/sideMenu';
import adminQueries from '../../queries/adminQueries';
import { useSnackbar } from 'notistack';

const DashBoard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [membershipType, setMembershipType] = useState('');
    const [showList, setShowList] = useState(false);
    const [count, setCount] = useState(false);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleSearchChange = (event) => {
        const value = event.target.value;
        if (value.charAt(0) === ' ') {
            setSearchTerm('');
            setMembershipType('');
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
        setLoading(true);
        CountsOfBooksAndMembers.mutateAsync();
    }, [membershipType, searchTerm])

    const CountsOfBooksAndMembers = adminQueries.CountsOfBooksAndMembersMutation(
        async (response) => {
            if (response?.data) {
                setCount(response?.data);
            } else {
                enqueueSnackbar('Error Fetching the Books And Members count..!', { variant: 'error' });
            }
            setLoading(false);
        },
        {
            onError: (error) => {
                enqueueSnackbar(error.response?.data?.message || 'Login failed', { variant: 'error' });
                setLoading(false);
            },
        }
    );


    const membershipTypes = [
        // {
        //     key: "A",
        //     label: "All Members",
        //     icon: Users,
        //     background: "bg-gradient-to-r from-cyan-500 to-blue-500",
        //     description: "View all membership types"
        // },
        {
            key: "MC",
            label: `Members: ${count.MembersCount} || N/A`,
            icon: UserCheck,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "TotalMembers Count",
            click: false,
        },
        {
            key: "BC",
            label: `Books: ${count.BooksCount} || N/A`,
            icon: UserCheck,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "Total Books Count",
            click: false,
        },
        {
            key: "I",
            label: "Individual",
            icon: UserCheck,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "Single membership accounts",
            click: true,
        },
        {
            key: "F",
            label: "Family",
            icon: UserPlus,
            background: "bg-gradient-to-r from-cyan-500 to-blue-500",
            description: "Family membership accounts",
            click: true,
        },
    ];

    const rmvBtnCase = () => {
        setMembershipType('');
        setSearchTerm('');
    }

    const handleTypeChange = (type) => {
        if (type.click) {
            setMembershipType(type.key);
            setSearchTerm(type.key);
        }
        return;
    };
    return (
        <>
            <div className="w-full h-screen bg-gray  shadow-2xl overflow-hidden grid md:grid-cols-6">
                <div className="col-span-6 p-4">
                    {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Membership Management
                    </h1> */}

                    {/* Search Section */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members by Name, ID, or Phone number"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                        <X
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => {
                                setSearchTerm('');
                                setMembershipType('');
                            }}
                        />
                    </div>

                    {searchTerm && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl mb-6">
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
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {membershipTypes.map((type, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleTypeChange(type)}
                                            className={`w-[400px] cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 ${membershipType === type.key
                                                ? `border-${type.background.split(' ')[1]} text-${type.background.split(' ')[1]} bg-${type.background.split(' ')[0]}`
                                                : 'border-gray-300 bg-gray-200  text-gray-800 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center bg-gray-200 rounded-lg space-y-4">
                                                <div
                                                    className={`flex items-center justify-center w-20 h-20 rounded-full border ${membershipType === type.key
                                                        ? `bg-${type.background.split(' ')[1]} text-white border-white`
                                                        : 'bg-gray-100 text-gray-600 border-gray-300'
                                                        }`}
                                                >
                                                    <type.icon className="w-10 h-10" />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-semibold text-xl">{type.label}</h3>
                                                    <p
                                                        className={`mt-2 text-sm ${membershipType === type.key ? 'text-white' : 'text-gray-500'
                                                            }`}
                                                    >
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
                            // </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
};

export default DashBoard;
