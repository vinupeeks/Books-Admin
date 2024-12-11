import React, { useCallback, useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";
import debounce from "lodash.debounce";
import BookSearchComp from "../BookIssuing/BookSearchComp";
import bookQueries from "../../queries/bookQueries";
import { useSnackbar } from "notistack";
import { Dropdown } from 'react-bootstrap';
import Pagination from "../../common/Pagination/Pagination";
import { Modal, Button } from "react-bootstrap";

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

  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { enqueueSnackbar } = useSnackbar();

  const [bookModal, setBookModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);


  const handleShow = (issue) => {
    setSelectedIssue(issue);
    setBookModal(true);
  };

  const handleMouseLeave = () => {
    setBookModal(false);
    setSelectedIssue(null);
  };
  const getMemberships = membershipsQueries.membershipListMutation(
    async (response) => {
      setMemberships(response?.data?.data?.items);
      // setMemberships(response?.data || []);
      setTotalCount(response?.data?.data?.totalItems);
      setTotalPage(response?.data?.data?.totalPages);
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
    const payload = {
      page: currentPage,
      size: pageSize,
      memType: membershipType,
    }
    // getMemberships.mutate({ membershipType });
    getMemberships.mutate(payload);
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
      window.location.reload();
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
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
      handleCheckRemove();
      window.location.reload();
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
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


  const handleSearchChange = (event) => {
    const value = event.target.value;
    if (value.charAt(0) === ' ') {
      console.log(`error`);

      setSearchTerm('');
      setMembershipType('A');
    }

    setSearchTerm(value);
    console.log('Input value:', value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text) {
        console.log('Searching for:', text);
        setLoading(true);
        const payload = {
          page: currentPage,
          size: pageSize,
          memID: text,
        };
        getMemberships.mutateAsync(payload);
      } else {
        const payload = {
          page: currentPage,
          size: pageSize,
          memType: membershipType,
        };
        getMemberships.mutate(payload);
      }
    }, 600),
    [currentPage, pageSize, membershipType]
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
  };

  useEffect(() => {
    setLoading(true);
    fetchMemberships();
  }, [membershipType, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-left text-gray-800 mb-8">
        Membership List {searchTerm ? 'SEARCH' : membershipType === 'F' ? 'FAMILY' : membershipType === 'I' ? 'SINGLE' : 'All'}
      </h1>

      <div className="flex items-center justify-between px-5 rounded-lg border-2 bg-gray-200 ">
        <div>
          <i>SELECT MEMBERSHIP TYPE : </i>
          <Dropdown className="d-inline-block">
            <Dropdown.Toggle
              title="Dropdown button"
              variant="secondary"
              id="dropdown-custom-components"
              className="px-auto py-auto text-sm font-medium bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 focus:outline-none focus:ring-auto transition-all"
            >
              {searchTerm ? 'SEARCH' : membershipType === 'F' ? 'FAMILY' : membershipType === 'I' ? 'SINGLE' : 'All'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-gray-200 border-gray-300">
              <Dropdown.Item
                onClick={() => handleTypeChange("A")}
                className={`bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 ${membershipType === "A" ? "bg-gray-300 text-gray-900" : ""
                  }`}
              >
                <i>&nbsp; All</i>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleTypeChange("I")}
                className={`bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 ${membershipType === "I" ? "bg-gray-300 text-gray-900" : ""
                  }`}
              >
                <i>&nbsp; Single</i>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleTypeChange("F")}
                className={`bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 ${membershipType === "F" ? "bg-gray-300 text-gray-900" : ""
                  }`}
              >
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
            // setSearchTerm(event.target.value);
            handleSearchChange(event);
          }}
          className="border-2 bg-gray-200 border-sky-500 rounded-lg  text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-2 w-auto uppercase"
        // style={{ padding: '8px', margin: '10px 0', width: '20%' }}
        />
      </div>

      <br />

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left w-10">Number</th>
              <th className="px-4 py-2 text-leftw-10">Membership ID</th>
              <th className="px-4 py-2 text-left w-auto">Name</th>
              <th className="px-4 py-2 text-left w-auto">Status</th>
              <th className="px-4 py-2 text-left w-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships?.map((membership, index) => {
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
                          <p
                            onMouseEnter={() => handleShow(issue)}
                            // onMouseLeave={handleMouseLeave}
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              width: "auto"
                            }}
                          >Book: {issue.Book ? issue.Book.title : "No Book"}</p>
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

      <Modal show={bookModal} onHide={handleMouseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIssue && (
            <div>
              <p>
                <strong>Title:</strong> {selectedIssue?.Book?.title || "No title"}
              </p>
              <p>
                <strong>Author:</strong> {selectedIssue?.Book?.author || "No author"}
              </p>
              <p>
                <strong>ISBN:</strong> {selectedIssue?.Book?.ISBN || "No ISBN"}
              </p>
              <p>
                <strong>Issue Date:</strong>{" "}
                {new Date(selectedIssue.issueDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleMouseLeave}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal */}
      {
        showModal && (
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
                        {/* <p style={{ color: 'green' }}>You are Eligible</p> */}
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
                          {/* <p style={{ color: 'red' }}>You are Not Eligible</p> */}
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
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
                      className="px-6 py-2 bg-green-300 text-black rounded-lg hover:bg-green-400 mr-2"
                      onClick={handleBookIssueSubmit}
                    >
                      Issue
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onPageChange={handlePageChange} />
    </div >
  );
};

export default MembersList;
