import { useAppContext } from "@/context/AppContext";
import PkgById from "./PkgById";
import { useEffect, useState } from "react";

const CheckoutComponent: React.FC = () => {
  const { sharedState } = useAppContext();
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      if (
        sharedState.basketIdent &&
        sharedState.packages.length > 0 &&
        sharedState.packages.some((pkg) => pkg !== "")
      ) {
        const baseUrl = "https://headless.tebex.io";
        const url = `${baseUrl}/api/accounts/${
          import.meta.env.VITE_WEBSTORE_IDENT
        }/baskets/${sharedState.basketIdent}`;
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const json = await response.json();
        setCheckoutUrl(json.data.links.checkout);
        setTotalPrice(json.data.total_price);
      }
    };

    fetchCheckoutDetails();
  }, [sharedState.basketIdent, sharedState.packages]);

  return (
    <>
      {checkoutUrl && (
        <div>
          <p>Total Price: {totalPrice}</p>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <button>Go to Checkout</button>
          </a>
        </div>
      )}
    </>
  );
};

const Cart: React.FC = () => {
  // @ts-expect-error how can i ignore this
  const { sharedState, setSharedState } = useAppContext();
  return (
    <div className="flex h-screen">
      <div className="h-min w-1/2 overflow-auto bg-slate-800 p-4 text-white">
        <h2 className="mb-4 text-xl">Packages in your cart:</h2>
        {sharedState.packages
          .filter((item) => item !== "")
          .map((item: string) => (
            <PkgById key={item} id={item} />
          ))}
      </div>

      <div className="h-full w-1/2 p-4">
        <CheckoutComponent />
      </div>
    </div>
  );
};

export default Cart;
