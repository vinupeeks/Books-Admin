import React from 'react';

const ConfirmationBox = ({
    isOpen,
    title = "Are you sure?",
    message = "Do you really want to perform this action?",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
                <h3 className="text-xl font-bold text-center text-red-600 mb-4">{title}</h3>
                <p className="text-gray-700 text-center mb-6">{message}</p>
                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationBox;
