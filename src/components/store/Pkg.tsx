import { PkgProps } from "@/types";
import { useToast } from "../ui/use-toast";
import { memo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";

const Pkg: React.FC<PkgProps> = ({ size, showDesc, item }) => {
  const { toast } = useToast();

  const addtoCart = async (id: string) => {
    // make request
    const url = `https://headless.tebex.io/api/baskets/basketID/packages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ packageId: id }),
    });
    const json = await res.json();

    // test with real request later
    toast({
      description: `${item.name} added to cart`,
    });
  };

  return (
    <div className="rounded-lg bg-slate-800 p-6 text-white shadow-lg">
      <img
        src={item.imageURL}
        alt={item.name}
        className="h-30 mb-4 w-full rounded object-cover"
      />
      <h3 className="text-xl font-bold">{item.name}</h3>
      <div className="text-md">${item.price}</div>
      <div className="text-md mt-4">Category: {item.category.name}</div>
      <Button
        className="flex gap-3"
        onClick={() => {
          addtoCart(item.id);
        }}
      >
        <span>
          <FaCartPlus />
        </span>
        Add to Cart
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Show information</Button>
        </PopoverTrigger>
        <PopoverContent className="w-120 h-80 overflow-y-scroll">
          <div
            className="m-1"
            dangerouslySetInnerHTML={{ __html: item.innerhtml }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(Pkg);
