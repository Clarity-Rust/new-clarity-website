import React, { useEffect, useState } from 'react';
import { Package } from '@/types'; 

const PkgById: React.FC<{ id: string }> = ({ id }) => {
  const [pkg, setPkg] = useState<Package>();

  useEffect(() => {
    // fetch package by id  
    const url = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/packages/${id}`; 
    const fetchData = async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      return await data.json();
    };
    const json = fetchData();
    console.log(json);

  }, [id]);

  return (
    <div>{id}</div>
  )
};

export default PkgById;