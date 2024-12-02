import React, { useCallback, useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";
import debounce from "lodash.debounce";
import LastBooks from "../Books/LastBooks";
import BookSearchComp from "../BookIssuing/BookSearchComp";

const MembersList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [membershipType, setMembershipType] = useState("single");
  const [bookDetails, setBookDetails] = useState('');
  const [bookDetailsGet, setBookDetailsGet] = useState(false);
  const [selectedBook, SetSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTypeChange = (type) => {
    setMembershipType(type);
  };

  useEffect(() => {
    setLoading(true);
    fetchMemberships();
  }, [membershipType]);

  const getMemberships = membershipsQueries.membershipListMutation(
    async (response) => {
      // console.log(`Response from the memberships fetch: `.response)
      setMemberships(response?.data.rows || []);
      // console.log(memberships); 
      setLoading(false);
    },
    {
      onError: (error) => {
        setError("Error fetching membership data");
        setLoading(false);
      }
    }
  );

  const fetchMemberships = () => {
    getMemberships.mutate(membershipType);
  };

  const getMembershipById = membershipsQueries.membershipByIdMutation(
    async (response) => {
      // console.log(`Response from the memberships fetch: `.response)
      setSelectedMembership(response?.data?.Details || null);
      setLoading(false);
      setShowModal(true);
    },
    {
      onError: (error) => {
        setError("Error fetching membership details");
        setLoading(false);
      }
    }
  );

  const handleModalOpen = (membership) => {
    setLoading(true);
    getMembershipById.mutate(membership.membershipId);
  };

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);


    if (value === '') {
      setSelectedMembership('');
    } else {
      debouncedSearch(value);
    }
  };
  const debouncedSearch = useCallback(
    debounce((text) => {
      if (!text) {
        return;
      }

      setLoading(true);
      getMemberships.mutateAsync({ text });
    }, 300),
    []
  );

  const handleModalClose = () => {
    setBookDetails('')
    setBookDetailsGet(false);
    setShowModal(false);
    setSelectedMembership(null);
  };
  const handleCheckRemove = () => {
    setBookDetails('')
    setBookDetailsGet(false);
    console.log(`selected Book details is : `, selectedBook);
    SetSelectedBook(null)

    // setShowModal(false);
    // setSelectedMembership(null);
  };

  const getMemberBookDetails = membershipsQueries.memberBookDetailsMutation(
    async (response) => {
      setBookDetails(response?.data?.rows || null);

      if (bookDetails?.length <= 0) {
        setBookDetailsGet(true);
      }
      setLoading(false);
      // setShowModal(true);
    },
    {
      onError: (error) => {
        setError("Error fetching membership details");
        setLoading(false);
      }
    }
  );
  const IssueListForMembers = (member) => {
    setSelectedMember(member);
    setLoading(true);
    getMemberBookDetails.mutateAsync(member.id);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-left text-gray-800 mb-8">
        Membership List : {membershipType === 'family' ? 'FAMILY' : 'SINGLE'}
      </h1>

      <div className="flex items-center justify-between px-5 ">
        <div>
          <b>MEMBERSHIP - TYPES:</b>
          <button onClick={() => handleTypeChange("single")}><i>&nbsp;  Single</i></button> /&nbsp;
          <button onClick={() => handleTypeChange("family")}><i>Family</i></button>
        </div>
        <input
          type="text"
          placeholder="Search by Membership ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-2 w-64"
        // style={{ padding: '8px', margin: '10px 0', width: '20%' }}
        />
      </div>
      <br />

      {/* Table Layout */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Number</th>
              <th className="px-4 py-2 text-left">Membership ID</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Date Issued</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership, index) => (
              <tr key={membership.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{membership.membershipId}</td>
                <td className="px-4 py-2">
                  {membership.membershipType === "family" ? "F-MS" : "S-MS"}
                </td>
                <td className="px-4 py-2">
                  {new Date(membership.dateOfIssuingMembershipCard).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => handleModalOpen(membership)}
                  >
                    <span className="material-icons">visibility</span> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {showModal && selectedMembership && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={handleModalClose}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
            <div className="mb-2 bg-gray-300 p-2 rounded">
              <p className="mb-2">
                <strong>Membership ID:</strong> {selectedMembership.membershipId}
              </p>
              <p className="mb-2">
                <strong>Type:</strong> {selectedMembership.membershipType}
              </p>
              <p className="mb-2">
                <strong>Date Issued:</strong>{" "}
                {new Date(selectedMembership.dateOfIssuingMembershipCard).toLocaleDateString()}{" "}
                {new Date(selectedMembership.dateOfIssuingMembershipCard).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <h3 className="mt-4 mb-2 font-semibold bg-gray-200  p-2 rounded">{selectedMembership.membershipType === 'single' ? 'Member Details' : 'Members Details'}</h3>

            {
              !bookDetails?.length > 0 && bookDetailsGet && (
                <div
                  className="no-books warning-bg px-4 py-3 rounded-lg shadow-lg"
                  style={{ backgroundColor: "", border: "1px solid black", color: "gray", gap: '3px' }}
                >
                  <div className="flex flex-row items-start justify-between flex-wrap gap-4"
                  >
                    <div>
                      <p><b>Member Name:</b> {selectedMember.name}</p>
                      <p><b>Member ID:</b> {selectedMember.memID || 'N/A'} </p>
                    </div>
                    <div>
                      <p style={{ color: 'green' }}>You are Eligible</p>
                    </div>
                  </div>

                  <BookSearchComp selectedBook={selectedBook} SetSelectedBook={SetSelectedBook} />
                  <br />

                  <div className="flex justify-end space-x-2">
                    <button type="button" className="px-4 py-2  bg-gray-400 text-white rounded-lg hover:bg-gray-500 mr-2" onClick={handleCheckRemove} >Cancel</button>
                    <button type="button" className="px-4 py-2 bg-green-200 text-black rounded-lg hover:bg-green-300 mr-2" >Issue</button>
                  </div>
                </div>
              )
            }
            <div className="book-list">
              {bookDetails?.length > 0 && (
                bookDetails.map((data, index) => (
                  <div
                    key={data.id || index}
                    className="book-card warning-bg px-4 py-3 mb-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: "#ebdcd1", border: "1px solid #FF7043" }}
                  >
                    <div className="flex flex-row items-start justify-between flex-wrap gap-4"
                    >
                      <div>
                        <p><b>Member Name:</b> {selectedMember.name}</p>
                        <p><b>Member ID:</b> {selectedMember.memID || 'N/A'} </p>
                      </div>
                      <div>
                        <p style={{ color: 'red' }}>You are Not Eligible</p>
                      </div>
                    </div>
                    {/* <span>Out Standing Book :</span> */}
                    <p>
                      <strong>Book Name: </strong>
                      <span style={{ color: "#D84315" }}>
                        {data.Book?.title || "No Title Available"}
                      </span>
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button type="button" className="px-4 py-2  bg-gray-400 text-white rounded-lg hover:bg-gray-500 mr-2" onClick={handleCheckRemove}>Cancel</button>
                      <button type="button" className="px-4 py-2 bg-red-200 text-black rounded-lg hover:bg-red-300 mr-2" >Return Book</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <hr className="my-2" />

            {selectedMembership.MembershipDetails.map((detail) => (
              <div key={detail.id} className="mb-4">
                <div
                  className="flex flex-row items-end justify-between px-5"
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}
                >
                  <div>
                    <p>
                      <strong>Member-ID:</strong> {detail.Member.memID || 'N/A'}
                    </p>
                    <p>
                      <strong>Name:</strong> {detail.Member.name}
                    </p>
                    <p>
                      <strong>Contact:</strong> {detail.Member.contactNumber}
                    </p>
                    <p>
                      <strong>Flat Number:</strong> {detail.Member.flatNumber}
                    </p>
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      onClick={() => { IssueListForMembers(detail.Member) }}
                    >
                      Check Status
                    </button>
                  </div>
                </div>
                <br />
                <hr className="my-2" />
              </div>
            ))}

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;
