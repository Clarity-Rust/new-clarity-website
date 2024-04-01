import React, { useEffect, useState } from "react";
import { Package } from "@/types";
import { useToast } from "../ui/use-toast";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const PkgById: React.FC<{ id: string }> = ({ id }) => {
  const [pkg, setPkg] = useState<Package>();
  const { toast } = useToast();
  const { sharedState, setSharedState } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    // fetch package by id
    const url = `https://headless.tebex.io/api/accounts/${
      import.meta.env.VITE_WEBSTORE_IDENT
    }/packages/${id}`;
    const fetchData = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      setPkg({
        name: data.data.name,
        id: data.data.id,
        innerhtml: data.data.description,
        imageURL: data.data.image,
        price: data.data.total_price,
        category: {
          name: data.data.category.name,
          id: data.data.category.id,
        },
        type: data.data.type,
      });
    };

    fetchData();
  }, [id]);

  const removeFromCart = async (id: string) => {
    const url = `https://headless.tebex.io/api/baskets/${sharedState.basketIdent}/packages/remove`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ package_id: id }),
    });
    const data = await response.json();
    console.log(data);

    const updatedPackages = sharedState.packages.filter((pkg) => pkg !== id);

    setSharedState((prevState) => ({
      ...prevState,
      packages: updatedPackages,
    }));

    localStorage.setItem("packages", updatedPackages.join(","));

    toast({
      description: `Item removed from cart`,
      className: "dark",
    });

    navigate(0);
  };

  return (
    <div>
      {pkg && (
        <>
          <h2>{pkg.name}</h2>
          <p>ID: {pkg.id}</p>
          <p>Description: {pkg.innerhtml}</p>
          <img src={pkg.imageURL} alt={pkg.name} />
          <p>Price: {pkg.price}</p>
          <p>Type: {pkg.type}</p>
        </>
      )}
      {pkg && <button onClick={() => removeFromCart(pkg.id)}>Remove</button>}
    </div>
  );
};

export default PkgById;
