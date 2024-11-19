import React, { useEffect, useState } from "react";
import membershipsQueries from "../../queries/membershipQueries";

const MembersList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [membershipType, setMembershipType] = useState("single");

  const handleTypeChange = (type) => {
    setMembershipType(type);
  };

  useEffect(() => {
    setLoading(true);
    fetchMemberships();
  }, [membershipType]);

  const getMemberships = membershipsQueries.membershipListMutation(
    async (response) => {
      setMemberships(response?.data.rows || []);
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

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMembership(null); // Clear selected membership data
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Membership List
      </h1>

      <div>
        <b>MEMBERSHIP - TYPES:</b>
        <button onClick={() => handleTypeChange("single")}><i>Single</i></button> /&nbsp;
        <button onClick={() => handleTypeChange("family")}><i>Family</i></button>
      </div>
      <br />

      {/* Table Layout */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Membership ID</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Date Issued</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id} className="border-b hover:bg-gray-100">
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

      {/* Modal */}
      {showModal && selectedMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
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
            <h3 className="mt-4 mb-2 font-semibold">Members:</h3>
            {selectedMembership.MembershipDetails.map((detail) => (
              <div key={detail.id} className="mb-2">
                <p>
                  <strong>Name:</strong> {detail.Member.name}
                </p>
                <p>
                  <strong>Contact:</strong> {detail.Member.contactNumber}
                </p>
                <p>
                  <strong>Flat Number:</strong> {detail.Member.flatNumber}
                </p>
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
