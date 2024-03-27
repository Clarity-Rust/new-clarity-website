import { useEffect, useState } from "react";
import { Package } from "@/types";
import Pkg from "./Pkg";

const Cart: React.FC = () => {
  const [items, setItems] = useState<Package[]>([]);
  // fetch cart items from api in useeffect
  useEffect(() => {
    // fetch items from basket
    // setItems(items);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="h-min w-1/2 overflow-auto bg-slate-800 p-4 text-white">
        <h2 className="mb-4 text-xl">Packages in your cart:</h2>
        {items.map((item: Package) => (
          <Pkg key={item.id} item={item} size="wide" showDesc="showPop" />
        ))}
        <div className="mb-4 rounded bg-gray-700 p-4">Package 1</div>
        <div className="mb-4 rounded bg-gray-700 p-4">Package 2</div>
        <div className="mb-4 rounded bg-gray-700 p-4">Package 3</div>
      </div>

      <div className="h-full w-1/2 p-4">Testing.</div>
    </div>
  );
};

export default Cart;
