import React, { useEffect, useState } from 'react';
import { Package } from '@/types'; 

const PkgById: React.FC<{ id: string }> = ({ id }) => {
  const [pkg, setPkg] = useState<Package>();

  useEffect(() => {
    // fetch package by id  
  }, [id]);

  return (
    <div>{id}</div>
  )
};

export default PkgById;