import React, { useState, useEffect } from 'react';
import ReceiveImage from "../assets/register/image.png"; // import รูปภาพ

const Receive = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full h-full relative pt-20">
        <img
          src={ReceiveImage}
          alt="Receive"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Receive;
