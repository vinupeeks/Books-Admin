import React, { useState } from "react";

const IndividualMemberShip = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Membership</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.members.map((member, index) => (
          <div key={index} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                value={member.contactNumber}
                onChange={(e) => handleChange(index, "contactNumber", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tower Name</label>
              <input
                type="text"
                value={member.towerName}
                onChange={(e) => handleChange(index, "towerName", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Flat Number</label>
              <input
                type="text"
                value={member.flatNumber}
                onChange={(e) => handleChange(index, "flatNumber", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={member.dateOfBirth}
                onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">Membership Type</label>
          <select
            value={formData.membershipType}
            onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="single">Single</option>
            {/* <option value="family">Family</option> */}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndividualMemberShip;
