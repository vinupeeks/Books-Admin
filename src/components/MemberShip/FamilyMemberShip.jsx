import React, { useState } from "react";
import RouteConstants from "../../constant/Routeconstant";
import { useNavigate } from "react-router-dom";

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

const FamilyMemberShip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    members: [
      {
        name: "",
        contactNumber: "",
        towerName: "",
        flatNumber: "",
        dateOfBirth: "",
      },
    ],
    membershipType: "single",
  });

  const handleChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const addMember = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      members: [
        ...prevFormData.members,
        {
          name: "",
          contactNumber: "",
          towerName: "",
          flatNumber: "",
          dateOfBirth: "",
        },
      ],
      membershipType: "family",
    }));
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!window.confirm("Are you sure you want to continue?")) {
      return;
    }
    console.log(`Form data: `, formData);


    try { 
      const response = await fetch("http://localhost:1000/membership/creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Membership created successfully!");
        setFormData({
          members: [
            {
              name: "",
              contactNumber: "",
              towerName: "",
              flatNumber: "",
              dateOfBirth: "",
            },
          ],
          membershipType: "single",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating membership:", error);
      alert("An error occurred while creating the membership.");
    }
  };
  const handleCancelBtn = () => {

    if (!window.confirm("Are you sure you want to continue?")) {
      return;
    }
    setFormData({
      members: [
        {
          name: "",
          contactNumber: "",
          towerName: "",
          flatNumber: "",
          dateOfBirth: "",
        },
      ],
      membershipType: "",
    });
    navigate(RouteConstants.DASHBOARD)
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Membership Creation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.members.map((member, index) => (
          <div key={index} className="px-4 py-2 bg-gray-200 rounded-lg space-y-4 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Member {index + 1}
              {formData.members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="ml-4 text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </h3>
            <InputField
              label="Name"
              type="text"
              value={member.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
            <InputField
              label="Contact Number"
              type="tel"
              value={member.contactNumber}
              onChange={(e) => handleChange(index, "contactNumber", e.target.value)}
              required
            />
            <InputField
              label="Tower Name"
              type="text"
              value={member.towerName}
              onChange={(e) => handleChange(index, "towerName", e.target.value)}
              required
            />
            <InputField
              label="Flat Number"
              type="text"
              value={member.flatNumber}
              onChange={(e) => handleChange(index, "flatNumber", e.target.value)}
              required
            />
            <InputField
              label="Date of Birth"
              type="date"
              value={member.dateOfBirth}
              onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)}
              // required
            />
          </div>
        ))}
        <label className="block text-sm font-medium text-gray-700">Membership Type</label>
        <select
          value={formData.membershipType}
          onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {/* <option value="single">Single</option> */}
          {/* <option value="family">Family</option> */}
          {formData.members.length === 1 ? (
            <option value="single">Single</option>
          ) : (
            <option value="family">Family</option>
          )}
        </select>
        {console.log(`form data from checking stage :`, formData)
        }

        <div className="flex items-center justify-between px-5">

          <button
            type="button"
            onClick={handleCancelBtn}
            className="flex items-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={addMember}
              className=" bg-indigo-400 text-white py-2 px-4 rounded-md hover:bg-indigo-500"
            >
              Add Another Member
            </button>
            <div>
            </div>
            <button
              type="submit"
              className=" bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
            >
              Submit
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default FamilyMemberShip;
