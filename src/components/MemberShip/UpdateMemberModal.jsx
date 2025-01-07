import React, { useState, useEffect } from "react";
import { TbRulerMeasure } from "react-icons/tb";
import membershipsQueries from "../../queries/membershipQueries";
import { useSnackbar } from "notistack";
import ConfirmationBox from "../../utils/ConfirmationBox";

const UpdateMemberModal = ({ member, isOpen, onClose, onUpdate, setSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        towerName: "",
        flatType: "",
        floorNumber: "",
        dateOfBirth: "",
    });
    const [loading, setLoading] = useState(false);
    const [isConfirmationBoxOpen, setIsConfirmationBoxOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (member) {
            setFormData({
                memId: member.id,
                name: member.name || "",
                contactNumber: member.contactNumber || "",
                towerName: member.towerName || "",
                flatType: member.flatType || "",
                floorNumber: member.floorNumber || "",
                dateOfBirth: member.dateOfBirth || "",
            });
        }
    }, [member]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const editMemberDetails = membershipsQueries.editMemberDetailsMutation(
        async (response) => {
            if (response?.data?.success) {
                setSuccess((prev) => !prev);
                enqueueSnackbar(`${response.data?.message}`, { variant: 'success' });
                console.log(response.data);
                onUpdate(formData);
                setLoading(false);
                onClose();
            }
            else {
                enqueueSnackbar(`${response?.message}`, { variant: 'warning' });
            }
        },
        {
            onError: (error) => {
                setError("Error updating member details..!");
                setLoading(false);
            }
        }
    );
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirmationBoxOpen(true);
        // setLoading(true);
        // editMemberDetails.mutate(formData);
    };
    const handleConfirm = () => {
        setIsConfirmationBoxOpen(false);
        setLoading(true);
        editMemberDetails.mutateAsync(formData);
    };
    const handleCancel = () => {
        setIsConfirmationBoxOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto"
                style={{ maxHeight: "70vh" }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">UPDATE MEMBER</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Tower Name</label>
                        <select
                            name="towerName"
                            value={formData.towerName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Tower
                            </option>
                            <option value="Brown">Brown</option>
                            <option value="Columbia">Columbia</option>
                            <option value="Cornell">Cornell</option>
                            <option value="Harvard">Harvard</option>
                            <option value="Princeton">Princeton</option>
                            <option value="Sylvania">Sylvania</option>
                            <option value="Yale">Yale</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Flat Type</label>
                        <select
                            name="flatType"
                            value={formData.flatType}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Flat
                            </option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Floor Number</label>
                        <select
                            name="floorNumber"
                            value={formData.floorNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Floor
                            </option>
                            {Array.from({ length: 23 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={
                                formData.dateOfBirth
                                    ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={handleInputChange}
                            // required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmationBox
                isOpen={isConfirmationBoxOpen}
                title="Confirm Submission"
                message="Are you sure you want to submit this editions?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default UpdateMemberModal;
