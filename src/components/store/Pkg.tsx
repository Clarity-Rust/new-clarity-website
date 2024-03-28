import { PkgProps } from "@/types";
import { useToast } from "../ui/use-toast";
import { memo } from "react";
import { useAppContext } from "@/context/AppContext";
import { CiCircleInfo } from "react-icons/ci";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";

const Pkg: React.FC<PkgProps> = ({ item }) => {
  const { toast } = useToast();
  const { sharedState, setSharedState } = useAppContext();

  const addToCart = async (
    id: string,
    type: string | undefined = undefined
  ) => {
    const url = `https://headless.tebex.io/api/baskets/${sharedState.basketIdent}/packages`;
    interface RequestBody {
      package_id: string;
      type?: string;
    }
    let body: RequestBody = { package_id: id };

    if (type) {
      body = { ...body, type: type };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return toast({
        title: error.title,
        description: error.detail,
        className: "dark",
      });
    }

    const json = await res.json();
    setSharedState({ ...sharedState, packages: [...sharedState.packages, id] });
    toast({
      description: `${json.data.name} added to cart`,
      className: "dark",
    });
  };

  return (
    <div className="rounded-lg bg-slate-800 p-6 text-white shadow-lg">
      <img
        src={item.imageURL}
        alt={item.name}
        className="h-30 max-w-30 mb-4 w-full rounded object-cover"
      />
      <h3 className="text-xl font-bold">{item.name}</h3>
      <div className="text-md">${item.price}</div>
      <div className="flex">
        {item.type === "both" ? (
          <>
            <Button
              variant="outline"
              onClick={() => addToCart(item.id, "single")}
              className="dark"
            >
              <span>
                <FaCartPlus size={22} />
              </span>
              One-time
            </Button>
            <Button
              variant="outline"
              onClick={() => addToCart(item.id, "subscription")}
              className="dark"
            >
              Subscribe
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => addToCart(item.id)}
            className="dark"
          >
            <span>
              <FaCartPlus size={22} />
            </span>
            Add to Cart
          </Button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="dark">
            <span>
              <CiCircleInfo size={22} />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-120 dark h-80 overflow-y-scroll">
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
