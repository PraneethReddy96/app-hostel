import React from 'react';

export const DeviceFrame = ({ children }) => {
  return (
    <div className="device-container-wrapper mode-fluid">
      <div className="fluid-wrapper">
        {children}
      </div>
    </div>
  );
};
