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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";

const Pkg: React.FC<PkgProps> = ({ item }) => {
  const { toast } = useToast();
  const { sharedState, setSharedState } = useAppContext();
  const [selectedOption, setSelectedOption] = useState<string>("one-time");
  const [steamId, setSteamId] = useState<string>("");

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
    target_username: string | undefined = undefined,
  ) => {
    const url = `https://headless.tebex.io/api/baskets/${sharedState.basketIdent}/packages`;

    interface RequestBody {
      package_id: string;
      type?: string;
      target_username_id?: string;
    }

    let body: RequestBody = { package_id: id };
    if (type) {
      body = { ...body, type: type };
    }

    if (target_username) {
      body = { ...body, target_username_id: target_username };
    }

    console.log(body);

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
    console.log(json);

    // Retrieve the current packages from localStorage, parse it, or initialize an empty array if it doesn't exist
    const currentPackages = JSON.parse(
      localStorage.getItem("packages") || "[]",
    );

    // Update the packages list with the new package id
    const updatedPackages = [...currentPackages, id];

    // Update the shared state
    setSharedState((prevState) => ({
      ...prevState,
      packages: updatedPackages,
    }));

    // Store the updated packages list in localStorage in JSON format
    localStorage.setItem("packages", JSON.stringify(updatedPackages));

    toast({
      description: `${json.data.packages.at(-1).name} (${type || "default"}) ${target_username !== undefined ? "gifted" : "added to cart"}`,
      className: "dark",
    });
  };

  return (
    <div className="min-w-[250px] max-w-[350px] overflow-auto rounded-lg bg-[#333342] p-4 text-white shadow-lg">
      <img
        src={item.imageURL}
        alt={item.name}
        className="mb-4 h-48 w-full rounded-lg object-fill"
      />
      <h3 className="mb-2 text-2xl font-bold">{item.name}</h3>
      <div className="text-md mb-4 font-semibold">${item.price}</div>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <RadioGroup
            defaultValue="subscription"
            className="dark"
            onValueChange={(value) => setSelectedOption(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="subscription"
                id={`subscription${item.id}`}
              />
              <Label htmlFor={`subscription${item.id}`}>Subscribe</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="onetime" id={`onetime${item.id}`} />
              <Label htmlFor={`onetime${item.id}`}>One time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gift" id={`gift${item.id}`} />
              <Label htmlFor={`gift${item.id}`}>This is a gift</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        {selectedOption === "gift" ? (
          <Dialog>
            <DialogTrigger className="dark flex-1 rounded-sm bg-gray-800 text-sm">
              Enter Steam ID
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter your friend's Steam ID.</DialogTitle>
                <DialogDescription className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    onChange={(e) => {
                      setSteamId(e.target.value);
                    }}
                    type="number"
                    placeholder="76561198..."
                  />
                  <Button
                    onClick={() => {
                      addToCart(item.id, "single", steamId);
                    }}
                    className="dark bg-slate-400"
                  >
                    Submit
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              handleAddToCart(item.type === "single");
            }}
            className="dark flex-1 bg-green-600"
          >
            <span className="mr-2">
              <FaCartPlus size={23} />
            </span>
            Add to cart
          </Button>
        )}
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
