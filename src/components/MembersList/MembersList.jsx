import React, { useCallback, useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";
import debounce from "lodash.debounce";
import BookSearchComp from "../BookIssuing/BookSearchComp";
import bookQueries from "../../queries/bookQueries";
import { useSnackbar } from "notistack";
import Pagination from "../../common/Pagination/Pagination";
import { Modal, Button } from "react-bootstrap";
import { ChevronDown, ChevronUp, NotepadText, SquarePen } from "lucide-react";
import UpdateMemberModal from "../MemberShip/UpdateMemberModal";

import { useDispatch } from 'react-redux';
import { clearSearchTerm } from "../../redux/reducers/searchReducers";
import FamilyListTable from "./FamilyListTable";
import ConfirmationBox from "../../utils/ConfirmationBox";

const MembersList = ({ searchTerm, setSearchTerm, membershipType, setMembershipType }) => {

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [bookDetailsGet, setBookDetailsGet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [show, setShow] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [isRevealed, setIsRevealed] = useState(false);

  const [bookModal, setBookModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [success, setSuccess] = useState(false);

  const [isConfirmationBoxOpen, setIsConfirmationBoxOpen] = useState(false);
  const [message, setMessage] = useState({
    action: "",
    title: "",
    message: "",
  });

  const handleUpdateMember = (success, updatedData) => {
    console.log('Updated Member:', updatedData);
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  const handlePhoneClick = () => {
    setIsRevealed(true);
    setTimeout(() => {
      setIsRevealed(false);
    }, 3000);
  };

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
      // window.location.reload();
      fetchMemberships();
      handleCheckRemove();
      setLoading(false);
      dispatch(clearSearchTerm());
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
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
    setMessage({
      action: "issue",
      title: "Issue Book",
      message: "Are you sure you want to issue this book? This action can't be undone.",
    })
    setIsConfirmationBoxOpen(true);
  }

  const handleConfirm = () => {
    if (message.action === "issue") {
      const payload = {
        bookId: selectedBook?.id,
        memberId: selectedMember?.id
      }
      setLoading(true);
      BookIssueSubmit.mutateAsync(payload);
      setIsConfirmationBoxOpen(false); 
    }
    const returnBookID = bookDetails[0].id;
    setLoading(true);
    BookIssueReturn.mutateAsync({ returnBookID });
    setIsConfirmationBoxOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmationBoxOpen(false);
    setMessage({ action: "", title: "", message: "" });
  };

  const BookIssueReturn = bookQueries.BookIssueReturnMutation(
    async (response) => {
      handleCheckRemove();
      fetchMemberships();
      setLoading(false);
      dispatch(clearSearchTerm());
      enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
    },
    {
      onError: (error) => {
        setError("Error fetching membership details");
        setLoading(false);
      }
    }
  );
  const handleBookReturn = () => {
    // const isConfirmed = window.confirm("Are you sure you want to return this book ?");

    // if (!isConfirmed) {
    //   return;
    // }
    // const returnBookID = bookDetails[0].id;
    // setLoading(true);
    // BookIssueReturn.mutateAsync({ returnBookID });

    setMessage({
      action: "return",
      title: "Return Book",
      message: "Are you sure you want to return this book? This action can't be undone.",
    })
    setIsConfirmationBoxOpen(true);
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
  }, [membershipType, currentPage, pageSize, success]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleToggleRow = (membershipId) => {
    setExpandedRow(prevRow => (prevRow === membershipId ? null : membershipId));
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className=" bg-gray-50 min-h-screen">
      <br />
      <Modal show={bookModal} onHide={handleMouseLeave}
        centered>
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[75vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-1">Membership Details</h2>
              <div className="mb-2 bg-gray-300 p-2 rounded">
                <p className="mb-2">
                  <strong>Membership ID:</strong> {selectedMembership.memID}
                </p>
                <p className="mb-2">
                  <strong>Contact No:</strong>{' '}
                  <span
                    onClick={handlePhoneClick}
                    className="cursor-pointer text-blue-500 hover:underline"
                  >
                    {isRevealed ? selectedMembership.contactNumber : `******${selectedMembership.contactNumber.slice(-4)}`}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Tower Name:</strong> {selectedMembership.towerName}
                </p>
                <p className="mb-2">
                  <strong>Flat Name:</strong> {selectedMembership.flatType}{selectedMembership.floorNumber}
                </p>
                <p className="mb-2">
                  <strong>DOB:</strong>
                  {/* {selectedMembership.dateOfBirth} */}
                  {new Date(selectedMembership.dateOfBirth).toLocaleDateString()}
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
      {memberships?.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <div className=" text-black dark:text-gray-300 p-2">
            &nbsp; {currentPage * pageSize + 1} - {currentPage * pageSize + memberships.length} out of {totalCount} members.
          </div>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 text-center w-10">#</th>
                <th className="px-4 py-2 text-leftw-10">Membership ID</th>
                <th className="px-4 py-2 text-left w-auto">Name</th>
                <th className="px-4 py-2 text-left w-auto">Status</th>
                <th className="px-4 py-2 text-left w-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships?.map((membership, index) => {
                const hasBook = membership.Issues.some((issue) => issue.Book);
                const isRowExpanded = expandedRow === membership.id;
                return (
                  <>
                    <tr
                      key={membership.id}
                      className={`border-b hover:bg-gray-100 ${hasBook ? "bg-gradient-to-r from-cyan-100 to-blue-100" : "bg-gray-200"}`}
                    >
                      <td className="px-4 py-2">
                        {currentPage * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2">{membership.memID}</td>
                      <td className="px-4 py-2">{membership.name}</td>
                      <td className="px-4 py-2">
                        {membership.Issues.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {membership.Issues.map((issue) => (
                              <div key={issue.id} className="flex items-center gap-2">
                                <NotepadText
                                  className="w-5 h-5"
                                  onMouseEnter={() => handleShow(issue)}
                                  style={{ cursor: "pointer" }}
                                />
                                <span>{issue.Book && issue.Book.title ? issue.Book.title : "No title available"}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">---</p>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-between gap-2">
                          {/* {membership.memID.startsWith("F") ? (
                            <button
                              type="button"
                              className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                              onClick={() => handleToggleRow(membership.id)}
                            >
                              {
                                expandedRow && isRowExpanded ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )
                              }
                            </button>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )} */}
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-lg mr-2 ${hasBook
                              ? "bg-gradient-to-r from-cyan-200 to-blue-200 hover:bg-red-100"
                              : "bg-gray-300 hover:bg-gray-200"
                              }`}
                            onClick={() => handleModalOpen(membership)}
                          >
                            {hasBook ? "Return" : "\u00A0\u00A0Issue"}
                          </button>

                          <button
                            type="button"
                            className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                            onClick={() => openModal(membership)}
                          >
                            <SquarePen className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {
                      expandedRow && isRowExpanded && (
                        <FamilyListTable id={expandedRow} />
                      )
                    }
                  </>
                );
              })}
            </tbody>

          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            show={show}
            onPageChange={handlePageChange} />
          <br />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-md shadow-md">
          <h2 className="mt-4 text-lg font-semibold text-gray-700">No Members Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't find any members matching your search. Try modifying your criteria.
          </p>
        </div>
      )
      }
      <UpdateMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpdate={handleUpdateMember}
        setSuccess={setSuccess}
      />
      <ConfirmationBox
        isOpen={isConfirmationBoxOpen}
        title={message.title}
        // message="Are you sure you want to create? This action can't be undone."
        message={message.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div >
  );
};

export default MembersList;

