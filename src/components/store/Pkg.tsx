import { PkgProps } from "@/types";
import { useToast } from "../ui/use-toast";
import { useAppContext } from "@/context/AppContext";
import { CiCircleInfo } from "react-icons/ci";
import { BsArrowRepeat } from "react-icons/bs";
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
    <div className="rounded-lg bg-slate-800 p-6 text-white shadow-lg">
      <img
        src={item.imageURL}
        alt={item.name}
        className="mb-4 h-48 w-full rounded-lg object-cover"
      />
      <h3 className="mb-2 text-2xl font-bold">{item.name}</h3>
      <div className="text-md mb-4 font-semibold">${item.price}</div>
      <div className="mb-4 flex flex-col gap-1">
        {item.type === "both" ? (
          <>
            <Button
              variant="outline"
              onClick={() => addToCart(item.id, "single")}
              className="dark flex-1"
            >
              <span className="mr-2">
                <FaCartPlus size={18} />
              </span>
              One-time
            </Button>
            <Button
              variant="outline"
              onClick={() => addToCart(item.id, "subscription")}
              className="dark flex-1"
            >
              <span className="mr-2">
                <BsArrowRepeat size={18} />
              </span>
              Subscribe
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => addToCart(item.id)}
            className="dark flex-1"
          >
            <span className="mr-2">
              <FaCartPlus size={18} />
            </span>
            Add to Cart
          </Button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="dark ">
            <span className="flex gap-1">
              <CiCircleInfo size={18} />
              View kit details
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
  );
};

export default Pkg;
