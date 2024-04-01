import { PkgProps } from "@/types";
import { useToast } from "../ui/use-toast";
import { useAppContext } from "@/context/AppContext";
import { CiCircleInfo } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

const Pkg: React.FC<PkgProps> = ({ item }) => {
  const { toast } = useToast();
  const { sharedState, setSharedState } = useAppContext();
  const [selectedOption, setSelectedOption] = useState<string>("one-time");

  const handleAddToCart = (oneChoice = false) => {
    if (oneChoice === true) {
      addToCart(item.id, "single");
    } else {
      addToCart(
        item.id,
        selectedOption === "subscription" ? "subscription" : "single",
      );
    }
  };

  const addToCart = async (
    id: string,
    type: string | undefined = undefined,
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
    localStorage.setItem("packages", [...sharedState.packages, id].join(","));
    const subscriptionType = type ? "Subscription" : "single";
    toast({
      description: `${json.data.packages.at(-1).name} - ${subscriptionType} added to cart`,
      className: "dark",
    });
  };

  return (
    <div className="rounded-lg bg-slate-800 p-4 text-white shadow-lg">
      <img
        src={item.imageURL}
        alt={item.name}
        className="mb-4 h-48 w-full rounded-lg object-cover"
      />
      <h3 className="mb-2 text-2xl font-bold">{item.name}</h3>
      <div className="text-md mb-4 font-semibold">${item.price}</div>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex  gap-2">
          <Checkbox
            id="isGift"
            onChange={() => setSelectedOption("gift")}
            className="dark"
          />
          <label
            htmlFor="isGift"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This is a gift
          </label>
        </div>
        {item.type === "both" && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="isSubscription"
              checked={selectedOption === "subscription"}
              onChange={() => setSelectedOption("subscription")}
              className="dark"
            />
            <label
              htmlFor="isSubscription"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Subscribe
            </label>
          </div>
        )}
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => {
            handleAddToCart(item.type === "single");
          }}
          className="dark mb-4 flex-1 bg-green-600"
        >
          <span className="mr-2">
            <FaCartPlus size={23} />
          </span>
          Add to cart
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="dark bg-blue-500">
              <span className="flex gap-1">
                <CiCircleInfo size={23} />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-100 dark h-80 overflow-y-auto p-4">
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: item.innerhtml }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Pkg;
