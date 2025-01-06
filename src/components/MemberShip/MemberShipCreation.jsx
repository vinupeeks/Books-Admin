import React, { useState } from "react";
import RouteConstants from "../../constant/Routeconstant";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { Button } from "react-bootstrap";
import membershipsQueries from "../../queries/membershipQueries";
import { useSnackbar } from "notistack";
import BackButton from "../../utils/BackButton";

const InputField = ({ label, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      required={required}
    />
  </div>
);

const MemberShipCreation = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [familyMemId, setFamilyMemId] = useState('');
  const [updatedMembers, setUpdatedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    members: [
      {
        name: "",
        contactNumber: "",
        towerName: "",
        floorNumber: "",
        flatType: "",
        dateOfBirth: "",
      },
    ],
    membershipType: "single",
  });

  const handleClose = () => setShow(false);

  const handleChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const addMember = () => {
    setFormData((prevFormData) => {
      const updatedMembers = [
        ...prevFormData.members,
        {
          name: "",
          contactNumber: "",
          towerName: "",
          floorNumber: "",
          flatType: "",
          dateOfBirth: "",
        },
      ];
      return {
        ...prevFormData,
        members: updatedMembers,
        membershipType: updatedMembers.length > 1 ? "family" : "single",
      };
    });
  };

  const removeMember = (index) => {
    setFormData((prevFormData) => {
      const updatedMembers = formData.members.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        members: updatedMembers,
        membershipType: updatedMembers.length > 1 ? "family" : "single",
      };
    })
  };

  const createMmbers = membershipsQueries.createMmberMutation(
    async (response) => {
      if (response?.status === 201) {
        setUpdatedMembers(response?.data?.data?.updatedMembers);
        setFamilyMemId(response?.data?.data?.membershipId);
        setShow(true)
        setFormData({
          members: [
            {
              name: "",
              contactNumber: "",
              towerName: "",
              floorNumber: "",
              flatType: "",
              dateOfBirth: "",
            },
          ],
          membershipType: "single",
        });
        setLoading(false);
        enqueueSnackbar('Successfully created Memberships..!', { variant: 'success' });
      }
    },
    {
      onError: (error) => {
        enqueueSnackbar('An error occurred while creating the membership. Please try again later.', { variant: 'error' });
        setLoading(false);
      }
    }
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to continue?")) {
      return;
    }
    try {
      const updatedMembershipType =
        formData.members.length > 1 ? "family" : "single";
      const updatedFormData = {
        ...formData,
        membershipType: updatedMembershipType,
      };
      console.log(updatedFormData);
      createMmbers.mutateAsync(updatedFormData);

    } catch (error) {
      console.log(error);
    }
  };
 
  const handleCancelBtn = () => {
    const hasDataLoaded = formData.members.some(
      (member) =>
        member.name ||
        member.contactNumber ||
        member.towerName ||
        member.floorNumber ||
        member.flatType ||
        member.dateOfBirth
    );

    if (hasDataLoaded) {
      if (!window.confirm("Are you sure you want to continue?")) {
        return;
      }
    }
    setFormData({
      members: [
        {
          name: "",
          contactNumber: "",
          towerName: "",
          floorNumber: "",
          flatType: "",
          dateOfBirth: "",
        },
      ],
      membershipType: "single",
    });
    navigate(RouteConstants.DASHBOARD);
  };


  return (
    <div className="mt-3">
      {/* <BackButton destination='/dashboard' /><br /> */}
      <div
        className="max-w-6xl flex flex-col border border-gray-300 rounded-lg shadow-lg mx-auto p-3 bg-white"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Members Creation</h2>
        <div className="p-2">
          <div
            className="max-w-3xl flex flex-col border border-gray-300 rounded-lg shadow-lg mx-auto p-3 bg-white"
          >

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="mb-2">
                <label className="block text-base font-medium text-gray-600 mb-1"><strong>Membership Type</strong></label>
                <select
                  value={formData.membershipType}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                  className="w-half px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                >
                  <option value="single">Single</option>
                  <option value="family">Family</option>
                </select>
              </div>

              {formData.members.map((member, index) => (
                <div key={index}>
                  <div className="mb-3 p-2 border border-gray-300 rounded-lg bg-white shadow-sm ">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Member {index + 1}
                      {formData.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="ml-3 text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </h3>
                    {/*  */}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Name</strong></label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-3/4 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Contact Number</strong></label>
                      <input
                        type="tel"
                        value={member.contactNumber}
                        onChange={(e) => handleChange(index, "contactNumber", e.target.value)}
                        className="w-3/4 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className=" flex flex-wrap justify-around items-center gap-4 bg-gray-200 rounded-lg p-2">
                      <div className="mb-2  flex items-center justify-center">
                        <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Tower Name</strong></label>
                        <select
                          type="text"
                          value={member.towerName}
                          onChange={(e) => handleChange(index, "towerName", e.target.value)}
                          className="w-half px-3 py-1 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                          required
                        >
                          <option value="" disabled>Select Tower</option>
                          <option value="Brown">Brown</option>
                          <option value="Columbia">Columbia</option>
                          <option value="Cornell">Cornell</option>
                          <option value="Harvard">Harvard</option>
                          <option value="Princeton">Princeton</option>
                          <option value="Sylvania">Sylvania</option>
                          <option value="Yale">Yale</option>
                        </select>
                      </div>

                      <div className="mb-2 flex items-center justify-center">
                        <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Flat Type</strong></label>
                        <select
                          type="text"
                          value={member.flatType}
                          onChange={(e) => handleChange(index, "flatType", e.target.value)}
                          className="w-half px-3 py-1 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                          required
                        >
                          <option value="" disabled>Select Flat</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="G">G</option>
                        </select>
                      </div>

                      <div className="mb-2 flex items-center justify-center">
                        <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Floor Number </strong></label>
                        <select
                          className="w-half px-3 py-1 bg-white bg-whiteborder border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                          value={member.floorNumber}
                          onChange={(e) => handleChange(index, "floorNumber", e.target.value)}
                          required
                        >
                          <option
                            className="max-h-5"
                            value="" disabled>Select Floor</option>
                          {Array.from({ length: 23 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1"><strong>Date of Birth</strong></label>
                      <input
                        type="date"
                        value={member.dateOfBirth}
                        onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)}
                        className="w-half px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <br />
                </div>
              ))}

              <div className="flex items-center justify-between mb-4">
                {formData.membershipType === "family" && formData.members.length < 4 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="bg-indigo-400 text-white py-1 px-3 rounded-md hover:bg-indigo-500"
                  >
                    Add Another Member
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelBtn}
                  className="w-auto h-10 bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-auto h-10 bg-indigo-500 text-white py-1 px-3 rounded-md hover:bg-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>


        <div>
          <>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered
              className="shadow-2xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>{updatedMembers?.length > 1 ? "Memberships Details" : "Membership Details"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Membership Type : &nbsp;{updatedMembers?.length > 1 ? "Family" : "Single"}</p>
                {updatedMembers?.length > 1 && (
                  <p>Family ID: {familyMemId}</p>)}
                <ul>
                  {updatedMembers?.map((member) => (
                    <li key={member.id}>
                      <strong>Name:</strong> {member.MemberName} - &nbsp;
                      <strong>Membership ID:</strong> {member.MemberId}
                    </li>
                  ))}
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default MemberShipCreation;
