// import { PkgProps } from "@/types";
// import { useToast } from "../ui/use-toast";
// import { memo } from "react";
// import { useAppContext } from "@/context/AppContext";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { FaCartPlus } from "react-icons/fa";

// const Pkg: React.FC<PkgProps> = ({ _size, _showDesc, item }) => {
//   const { toast } = useToast();
//   const { sharedState, _setSharedState } = useAppContext();

//   const addtoCart = async (id: string) => {
//     const url = `https://headless.tebex.io/api/baskets/${sharedState.basketIdent}/packages`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ package_id: id }),
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       return toast({
//         title: error.title,
//         description: error.detail,
//       });
//     }

//     const json = await res.json();

//     toast({
//       description: `${json.data.name} added to cart`,
//     });
//   };

//   return (
//     <div className="rounded-lg bg-slate-800 p-6 text-white shadow-lg">
//       <img
//         src={item.imageURL}
//         alt={item.name}
//         className="h-30 max-w-30 mb-4 w-full rounded object-cover"
//       />
//       <h3 className="text-xl font-bold">{item.name}</h3>
//       <div className="text-md">${item.price}</div>
//       <div className="text-md mt-4">Category: {item.category?.name}</div>
//       <Button
//         className="flex gap-3"
//         onClick={() => {
//           addtoCart(item.id);
//         }}
//       >
//         <span>
//           <FaCartPlus />
//         </span>
//         Add to Cart
//       </Button>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline">Show information</Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-120 h-80 overflow-y-scroll">
//           <div
//             className="m-1"
//             dangerouslySetInnerHTML={{ __html: item.innerhtml }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default memo(Pkg);
