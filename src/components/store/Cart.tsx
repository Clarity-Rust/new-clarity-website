import { useAppContext } from "@/context/AppContext";
import PkgById from "./PkgById";

const Cart: React.FC = () => {
  const { sharedState, setSharedState } = useAppContext();
  console.log(sharedState);
  return (
    <div className="flex h-screen">
      <div className="h-min w-1/2 overflow-auto bg-slate-800 p-4 text-white">
        <h2 className="mb-4 text-xl">Packages in your cart:</h2>
        {sharedState.packages.map((item: string) => (
          <PkgById key={item} id={item} />
        ))}
      </div>

      <div className="h-full w-1/2 p-4">Testing.</div>
    </div>
  );
};

export default Cart;
