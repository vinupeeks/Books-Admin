import React, { useEffect, useState } from 'react';
import { Search, Users, UserCheck, UserPlus, Sliders, X, Library, CornerDownLeft, LibraryBig } from 'lucide-react';
import MembersList from '../MembersList/MembersList';
import SideMenu from '../navbar/sideMenu';
import adminQueries from '../../queries/adminQueries';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';

import { useDispatch, useSelector } from 'react-redux';
import { clearSearchTerm, selectSearchTerm, setSearchTerm } from '../../redux/reducers/searchReducers';

const DashBoard = () => {

    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);

    // const [searchTerm, setSearchTerm] = useState('');
    const [selectTerm, setSelectTerm] = useState('');
    const [membershipType, setMembershipType] = useState('');
    const [showList, setShowList] = useState(false);
    const [count, setCount] = useState(false);
    const [booksCount, setBooksCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState(null);

    const handleClearSearchTerm = () => {
        dispatch(clearSearchTerm());
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        if (value.charAt(0) === ' ') {
            // setSearchTerm('');
            dispatch(clearSearchTerm());
            setMembershipType('');
            return;
        }
        // setSearchTerm(value);
        dispatch(setSearchTerm(value));
        console.log(searchTerm, selectTerm);

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
                setLoading(false);
            } else {
                enqueueSnackbar('Error Fetching the Books And Members count..!', { variant: 'error' });
                setLoading(false);
            }
        },
        {
            onError: (error) => {
                enqueueSnackbar(error.response?.data?.message || 'Login failed', { variant: 'error' });
                setLoading(false);
            },
        }
    );

    const membershipTypes = [
        {
            key: "IBC",
            label: `Issued Books: ${count.IssuedBooksCount ?? 'N/A'}`,
            action: true,
            navigate: RouteConstants.ISSUEDLIST,
            icon: Library,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "Total Issued Books Count",
            click: true,
        },
        {
            key: "BC",
            label: `Books: ${count.BooksCount ?? 'N/A'}`,
            action: true,
            navigate: RouteConstants.BOOKS,
            icon: LibraryBig,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "Total Books Count",
            click: true,
        },
        {
            key: "A",
            label: `Members: ${count.MembersCount ?? 'N/A'}`,
            icon: Users,
            background: "bg-gradient-to-r from-blue-500 to-cyan-500",
            description: "All membership accounts",
            click: true,
        },
        // {
        //     key: "I",
        //     label: "Individual",
        //     icon: UserCheck,
        //     background: "bg-gradient-to-r from-blue-500 to-cyan-500",
        //     description: "Single membership accounts",
        //     click: true,
        // },
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
        // setSearchTerm('');
        dispatch(clearSearchTerm());
    }

    const handleTypeChange = (type) => {
        if (type.click) {
            if (type.action) {
                navigate(type.navigate);
                return;
            }
            setMembershipType(type.key);
            if (type.key === 'I') {
                setSelectTerm('Individual List');
            }
            else if (type.key === 'A') {
                setSelectTerm('All Members List');
                setSelectedOption('A');
            } else {
                setSelectTerm('Family List');
            }

            // setSearchTerm(type.key);
        }
        return;
    };

    const handleSortClick = (option) => {
        setSelectedOption(option);
        setMembershipType(option);
        // console.log(`Selected: ${option}`);
    };

    return (
        <div className="w-full ms-1 min-h-screen bg-gray shadow-2xl overflow-y-auto grid md:grid-cols-6">
            <div className="col-span-6 p-4">
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search members by Name, ID, or Phone number"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full h-5 pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <X
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={() => {
                            // setSearchTerm('');
                            dispatch(clearSearchTerm());
                            setSelectedOption('');
                            setMembershipType('');
                            setSelectTerm('');
                        }}
                    />
                </div>

                {(searchTerm || selectTerm) && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl flex items-center justify-between px-4 py-2">
                        <p className="text-blue-700 flex-grow">
                            Searching for: <span className="font-semibold ml-2">{searchTerm || selectTerm}</span>
                        </p>
                        <div className="flex items-center space-x-4">
                            {
                                selectTerm === 'All Members List' && (
                                    <div className="flex items-center">
                                        <span className="font-semibold ml-2">Sort:</span>
                                        <button
                                            className={`ml-2 px-3 py-1 rounded-lg ${selectedOption === 'A' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleSortClick('A')}
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`ml-2 px-3 py-1 rounded-lg ${selectedOption === 'I' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleSortClick('I')}
                                        >
                                            Individual
                                        </button>
                                        <button
                                            className={`ml-2 px-3 py-1 rounded-lg ${selectedOption === 'F' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleSortClick('F')}
                                        >
                                            Family
                                        </button>
                                    </div>
                                )
                            }
                            <CornerDownLeft
                                className="text-gray-500 cursor-pointer"
                                onClick={() => {
                                    // setSearchTerm('');
                                    dispatch(clearSearchTerm());
                                    setSelectedOption('');
                                    setMembershipType('');
                                    setSelectTerm('');
                                }}
                            />
                        </div>
                    </div>
                )}
                <div>
                    {showList ? (
                        <div className="bg-gray-100 rounded-xl">
                            <MembersList
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                membershipType={membershipType}
                                setMembershipType={setMembershipType}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {membershipTypes?.map((type, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleTypeChange(type)}
                                        className={`relative p-3 rounded-xl h-fit shadow-lg border transition-transform transform hover:scale-105 duration-300 cursor-pointer ${membershipType === type.key
                                            ? `border-${type.background.split(' ')[1]} bg-gradient-to-br from-cyan-500 to-blue-500 text-white`
                                            : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-inner border-2 ${membershipType === type.key
                                                    ? 'bg-white text-blue-500 border-white'
                                                    : 'bg-gray-200 text-gray-600 border-gray-300'
                                                    }`}
                                            >
                                                <type.icon className="w-4 h-4 text-black-400" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-lg">{type.label}</h3>
                                                <p className="mt-1 text-sm text-blue-900">{type.description}</p>
                                            </div>
                                        </div>
                                        {/* {type.click && (
                                            <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-500">
                                                Clickable
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </div>
                            {membershipType && (
                                <button
                                    className="w-full mt-4 p-2 bg-gradient-to-r rounded-xl from-blue-500 to-cyan-500 transition duration-300 ml-auto"
                                    onClick={rmvBtnCase}
                                >
                                    CLEAR
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >

    );
};

export default DashBoard;
