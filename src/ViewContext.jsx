import React, { createContext, useContext, useState } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
    const [viewFormat, setViewFormat] = useState('table');

    return (
        <ViewContext.Provider
            value={{
                viewFormat,
                setViewFormat
            }}>
            {children}
        </ViewContext.Provider>
    );
};

export const useViewContext = () => useContext(ViewContext);
