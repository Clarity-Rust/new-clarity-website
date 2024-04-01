import React, { useEffect, useState } from "react";
import { Package } from "@/types";
import { useToast } from "../ui/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"; // Assume these are imported correctly
import { FaTrash } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { Button } from "../ui/button";

const PkgById: React.FC<{ id: string }> = ({ id }) => {
  const [pkg, setPkg] = useState<Package>();
  const { toast } = useToast();
  const { sharedState, setSharedState } = useAppContext();

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

    if (!response.ok) {
      toast({
        description: `${response.statusText}`,
        className: "dark",
      });
      return;
    }

    const updatedPackages = sharedState.packages.filter((pkg) => pkg !== id);

    setSharedState((prevState) => ({
      ...prevState,
      packages: updatedPackages,
    }));

    localStorage.setItem("packages", JSON.stringify(updatedPackages));

    toast({
      description: `Item removed from cart`,
      className: "dark",
    });
  };

  return pkg ? (
    <div className="mt-2 flex min-h-[200px] w-full items-center overflow-hidden bg-[#333342] p-4 text-white shadow-lg">
      <img
        src={pkg.imageURL}
        alt={pkg.name}
        className="rounded-lg object-fill"
        width={150}
        height={150}
      />
      <div className="ml-4 flex-1">
        <h3 className="text-2xl font-bold">{pkg.name}</h3>
        <p className="text-md font-semibold">${pkg.price}</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="dark mt-2 bg-blue-500">
              <CiCircleInfo size={23} />
              <span>More Info</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="dark h-80 w-96 overflow-y-auto p-4">
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: pkg.innerhtml }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => removeFromCart(pkg.id)}
          className="dark flex items-center gap-1 bg-red-600"
        >
          <FaTrash size={20} />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex min-h-[250px] w-full items-center justify-center overflow-hidden bg-[#333342] p-4 text-white shadow-lg">
      <p>Loading package data or package not found...</p>
    </div>
  );
};

export default PkgById;
