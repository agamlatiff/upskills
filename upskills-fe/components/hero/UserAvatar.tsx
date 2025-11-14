import React from 'react';

export const UserAvatar: React.FC<{ src: string }> = ({ src }) => (
  <img className="h-10 w-10 rounded-full border-2 border-white" src={src} alt="User" />
);
