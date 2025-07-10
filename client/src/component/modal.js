import React from 'react';

const Modal = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const modalColorClass = type === 'error' ? 'border-red-500' : 'border-blue-500';
  const textColorClass = type === 'error' ? 'text-red-700' : 'text-blue-700';
  const buttonBgClass = type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center border-t-4 ${modalColorClass}`}>
        <h3 className={`text-xl font-bold mb-4 ${textColorClass}`}>
          {type === 'error' ? 'Error!' : 'Information'}
        </h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 shadow-md text-white ${buttonBgClass}`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;