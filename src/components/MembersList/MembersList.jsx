import React, { useCallback, useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";
import debounce from "lodash.debounce";
import BookSearchComp from "../BookIssuing/BookSearchComp";
import bookQueries from "../../queries/bookQueries";
import { useSnackbar } from "notistack";
import { Dropdown } from 'react-bootstrap';

const MembersList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [membershipType, setMembershipType] = useState("A");
  const [bookDetails, setBookDetails] = useState(null);
  const [bookDetailsGet, setBookDetailsGet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [payload, setPayload] = useState({ memID: "", memType: "", })
  const { enqueueSnackbar } = useSnackbar();


  const getMemberships = membershipsQueries.membershipListMutation(
    async (response) => {
      // setMemberships(response?.data?.rows || []);
      setMemberships(response?.data || []);
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
    getMemberships.mutate({ membershipType });
  };

  const handleModalOpen = (membership) => {
    setSelectedMember(membership);
    if (membership.Issues.length === 0) {
      setBookDetails(null);
    } else {
      setBookDetails(membership.Issues);
    }
    setShowModal(true);
    setSelectedMembership(membership)
  };


  const BookIssueSubmit = bookQueries.BookIssueSubmitMutation(
    async (response) => {
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });

      window.location.reload();
      handleCheckRemove();
      setLoading(false);
    },
    {
      onError: (error) => {
        setError("Error fetching membership details");
        setLoading(false);
      }
    }
  );

  const handleBookIssueSubmit = () => {

    const isConfirmed = window.confirm("Are you sure you want to issue this book ?");
    if (!isConfirmed) {
      return;
    }
    const payload = {
      bookId: selectedBook?.id,
      memberId: selectedMember?.id
    }

    setLoading(true);
    BookIssueSubmit.mutateAsync(payload);
  }

  const BookIssueReturn = bookQueries.BookIssueReturnMutation(
    async (response) => {
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
      handleCheckRemove();
      window.location.reload();
      setLoading(false);
    },
    {
      onError: (error) => {
        setError("Error fetching membership details");
        setLoading(false);
      }
    }
  );
  const handleBookReturn = () => {
    const isConfirmed = window.confirm("Are you sure you want to return this book ?");

    if (!isConfirmed) {
      return;
    }
    const returnBookID = bookDetails[0].id;
    setLoading(true);
    BookIssueReturn.mutateAsync({ returnBookID });
  }


  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      setLoading(true);
      if (!text) {
        // getMemberships.mutate({ membershipType });
        getMemberships.mutate({ membershipType });
      }
      // getMemberships.mutateAsync({ search: text });
      getMemberships.mutateAsync({ text });
    }, 500),
    []
  );

  const handleModalClose = () => {
    setBookDetails('')
    setBookDetailsGet(false);
    setShowModal(false);
    setSelectedMembership(null);
    setSelectedBook(null)
    setSelectedMember(null)
  };
  const handleCheckRemove = () => {
    setShowModal(false);
    setBookDetails(null);
    setBookDetailsGet(false);
    setSelectedBook(null);
    setSelectedMembership(null);
  };

  const handleTypeChange = (type) => {
    setMembershipType(type);
    setSearchTerm('');
    // console.log(`type value: `, membershipType);

  };

  useEffect(() => {
    setLoading(true);
    fetchMemberships();
  }, [membershipType]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-left text-gray-800 mb-8">
        Membership List : {membershipType === 'F' ? 'FAMILY' : membershipType === 'I' ? 'SINGLE' : 'All'}
      </h1>

      <div className="flex items-center justify-between px-5 ">
        <div>
          <i>Select Membership Type: </i>
          <Dropdown className="d-inline-block">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-custom-components"
              className="px-auto py-auto text-sm font-medium bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 focus:outline-none focus:ring-auto transition-all"
            >
              {searchTerm ? 'SEARCH' : membershipType === 'F' ? 'FAMILY' : membershipType === 'I' ? 'SINGLE' : 'All'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item active={membershipType === 'A'} onClick={() => handleTypeChange("A")}>
                <i>&nbsp; All</i>
              </Dropdown.Item>
              <Dropdown.Item active={membershipType === 'I'} onClick={() => handleTypeChange("I")}>
                <i>&nbsp; Single</i>
              </Dropdown.Item>
              <Dropdown.Item active={membershipType === 'F'} onClick={() => handleTypeChange("F")}>
                <i>&nbsp; Family</i>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <input
          type="text"
          placeholder="Search by Membership"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            handleSearchChange(event);
          }}
          className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-2 w-auto uppercase"
        // style={{ padding: '8px', margin: '10px 0', width: '20%' }}
        />
      </div>

      <br />

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Number</th>
              <th className="px-4 py-2 text-left">Membership ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership, index) => {
              const hasBook = membership.Issues.some((issue) => issue.Book);
              return (
                <tr
                  key={membership.id}
                  className={`border-b hover:bg-gray-100 ${hasBook ? "bg-red-100" : "bg-gray-200"
                    }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{membership.memID}</td>
                  <td className="px-4 py-2">{membership.name}</td>
                  <td className="px-4 py-2">
                    {membership.Issues.length > 0 ? (
                      membership.Issues.map((issue) => (
                        <div key={issue.id}>
                          <p>Book: {issue.Book ? issue.Book.title : "No Book"}</p>
                        </div>
                      ))
                    ) : (
                      <p>---</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg mr-2 ${hasBook ? "bg-red-200 hover:bg-red-100" : "bg-gray-300 hover:bg-gray-200"
                        }`}
                      onClick={() => handleModalOpen(membership)}
                    >
                      {hasBook ? "Return" : "Issue"}
                    </button>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* modal */}
      {showModal && (
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
                <strong>Membership ID:</strong> {selectedMembership.memID}
              </p>
              <p className="mb-2">
                <strong>Contact No:</strong> {selectedMembership.contactNumber}
              </p>
              <p className="mb-2">
                <strong>Flat No:</strong> {selectedMembership.flatNumber}
              </p>
              <p className="mb-2">
                <strong>Membership Issued:</strong>{" "}
                {new Date(selectedMembership.createdAt).toLocaleDateString()}{" "}
                {new Date(selectedMembership.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <hr />
            {
              bookDetails == null && (
                <div
                  className="no-books warning-bg px-4 py-3 rounded-lg shadow-lg"
                  style={{ backgroundColor: "", border: "1px solid black", color: "gray", gap: '3px' }}
                >
                  <div className="flex flex-row items-start justify-between flex-wrap gap-4"
                  >
                    <div>
                      <p><b>Member Name:</b> {selectedMembership.name}</p>
                      {/* <p><b>Member ID:</b> {selectedMembership.memID || 'N/A'} </p> */}
                    </div>
                    <div>
                      <p style={{ color: 'green' }}>You are Eligible</p>
                    </div>
                  </div>

                  <BookSearchComp selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
                  <br />

                  <div className="flex justify-end space-x-2">
                  </div>
                </div>
              )
            }
            <div className="book-list">
              {selectedMembership.Issues.length > 0 && (
                bookDetails?.map((data, index) => (
                  <div
                    key={data.id || index}
                    className="book-card warning-bg px-4 py-3 mb-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: "#ebdcd1", border: "1px solid #FF7043" }}
                  >
                    <div className="flex flex-row items-start justify-between flex-wrap gap-4"
                    >
                      <div>
                        <p><b>Member Name:</b> {selectedMembership.name}</p>
                        {/* <p><b>Member ID:</b> {selectedMembership.memID || 'N/A'} </p> */}
                      </div>
                      <div>
                        <p style={{ color: 'red' }}>You are Not Eligible</p>
                      </div>
                    </div>
                    <p>
                      <strong>Book Name: </strong>
                      <span style={{ color: "#D84315" }}>
                        {data.Book?.title || "No Title Available"}
                      </span>
                    </p>
                    <p>
                      <strong>Book Issued: </strong>
                      <span style={{ color: "#D84315" }}>
                        {data?.issueDate
                          ? new Date(data.issueDate).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" })
                          : "No Date Available"}
                      </span>
                    </p>
                    <div className="flex justify-end space-x-2">
                    </div>
                  </div>
                ))
              )}
            </div>

            <hr className="my-2" />

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                onClick={handleModalClose}
              >
                Close
              </button>
              {
                selectedMembership.Issues.length > 0 ? (
                  <button type="button" className="px-4 py-2 bg-red-200 text-black rounded-lg hover:bg-red-300 mr-2" onClick={handleBookReturn}>Return Book</button>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-200 text-black rounded-lg hover:bg-green-300 mr-2"
                    onClick={handleBookIssueSubmit}
                  >
                    Issue
                  </button>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;