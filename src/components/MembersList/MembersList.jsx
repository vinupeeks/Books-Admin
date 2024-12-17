import React, { useCallback, useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";
import debounce from "lodash.debounce";
import BookSearchComp from "../BookIssuing/BookSearchComp";
import bookQueries from "../../queries/bookQueries";
import { useSnackbar } from "notistack";
import Pagination from "../../common/Pagination/Pagination";
import { Modal, Button } from "react-bootstrap";

const MembersList = ({ searchTerm, setSearchTerm, membershipType, setMembershipType }) => {

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [bookDetailsGet, setBookDetailsGet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [show, setShow] = useState(false);
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

    if (selectedBook === null) {
      enqueueSnackbar(`Select a book or close the section..!`, { variant: 'warning' });
      return;
    }

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


  useEffect(() => {
    handleSearchChange();
  }, [searchTerm])

  const handleSearchChange = (event) => {
    let value = searchTerm || '';
    if (value.charAt(0) === ' ') {
      console.log(`error`);

      setSearchTerm('');
      setMembershipType('A');
    }
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text) {
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
    <div className=" bg-gray-50 min-h-screen">
      <br />
      {/* 
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left w-10">SL.N</th>
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
                          >Book:</p> {issue.Book ? issue.Book.title : "No Book"}
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
      </div> */}

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
                <strong>Issue Date: </strong>
                {new Date(selectedIssue?.issueDate).toLocaleString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
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
                  <strong>Tower Name:</strong> {selectedMembership.towerName}
                </p>
                <p className="mb-2">
                  <strong>Flat Name:</strong> {selectedMembership.flatType}{selectedMembership.floorNumber}
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
                        <p><b>Member Name:</b> {selectedMembership?.name}</p>
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
                      {/* <p>
                        <strong>Book Issued: </strong>
                        <span style={{ color: "#D84315" }}>
                          {data?.issueDate
                            ? new Date(data.issueDate).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
                            : "No Date Available"}
                        </span>
                      </p> */}
                      <p>
                        <strong>Book Issued: </strong>
                        <span style={{ color: "#D84315" }}>
                          {data?.issueDate
                            ? new Date(data.issueDate).toLocaleString([], {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
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

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left w-10">SL.N</th>
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
                  // className={`border-b hover:bg-gray-100 ${hasBook ? "bg-red-100" : "bg-gray-200"
                  className={`border-b hover:bg-gray-100 ${hasBook ? "bg-gradient-to-r from-cyan-100 to-blue-100" : "bg-gray-200"
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
                          >Book:</p> {issue.Book ? issue.Book.title : "No Book"}
                        </div>
                      ))
                    ) : (
                      <p>---</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg mr-2 ${hasBook ? "bg-gradient-to-r from-cyan-200 to-blue-200 hover:bg-red-100" : "bg-gray-300 hover:bg-gray-200"
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        show={show}
        onPageChange={handlePageChange} />
    </div >
  );
};

export default MembersList;
