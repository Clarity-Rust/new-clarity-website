import { useAppContext } from "@/context/AppContext";
import PkgById from "./PkgById";
import { Fragment, useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { Button } from "../ui/button";
import { Gift } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

const Cart: React.FC = () => {
  // @ts-expect-error how can i ignore this
  const { sharedState, setSharedState } = useAppContext();
  const [checkoutAllowed, setCheckoutAllowed] = useState<boolean>(true); // assume everything is ok first
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gifts, setGifts] = useState<Gift[]>([]);

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

    // add useEffect to check if packages were gift. pass information to package component
    useEffect(() => {
      const fetchGiftInfo = async () => {
        const url = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/baskets/${sharedState.basketIdent}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        // parse the gift information, if it exists
        data.data.packages.forEach((pkg: any) => {
          if (pkg.in_basket.gift_username_id && pkg.in_basket.gift_username) {
            setGifts((prev) => [
              ...prev,
              {
                package_id: pkg.id,
                gift_username_id: pkg.in_basket.gift_username_id,
                gift_username: pkg.in_basket.gift_username,
              },
            ]);
          }
        });
      };

      fetchGiftInfo();
    }, [sharedState.basketIdent]);

    return (
      <>
        {checkoutUrl && (
          <div>
            <p className="text-lg font-bold">Total Price: ${totalPrice}</p>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                disabled={!checkoutAllowed}
                className="dark hover:bg-gray-800"
                size="lg"
              >
                Go to Checkout
              </Button>
            </a>
          </div>
        )}
      </>
    );
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center rounded-md p-4">
      <div className="flex h-3/4 w-full max-w-4xl flex-col items-center overflow-auto rounded-md p-4 text-white">
        <h2 className="text-xl">Packages in your cart:</h2>
        <ScrollArea className="w-full rounded-md border">
          {sharedState.packages.length > 0 ? (
            sharedState.packages.map((item: string, index, array) => {
              const matchingGift = gifts.find(
                (gift) => gift.package_id === item,
              );
              console.log(gifts);
              return (
                <Fragment key={item}>
                  <PkgById id={item} gift={matchingGift} />
                  {index === array.length - 1 && errorMessage !== "" && (
                    <div className="mt-4 flex items-center text-red-400">
                      <span className="mr-2 text-lg">
                        <CiCircleInfo />
                      </span>
                      This div will contain info about why the checkout is
                      disabled.
                    </div>
                  )}
                </Fragment>
              );
            })
          ) : (
            <p>Your cart is empty.</p>
          )}
        </ScrollArea>
      </div>

      <div className="mt-4 flex w-full max-w-4xl flex-col items-center">
        <CheckoutComponent />
      </div>
    </div>
  );
};

export default Cart;
