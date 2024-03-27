// import { Package, SearchFilters } from "@/types";
// import { useState, useEffect } from "react";
// import { useMemo } from "react";

// import Pkg from "./Pkg";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const Filter: React.FC<{
//   filter: SearchFilters;
//   setFilter: (filter: SearchFilters) => void;
// }> = ({ filter, setFilter }) => {
//   return (
//     <Select
//       value={filter.type}
//       onValueChange={(value) => setFilter({ ...filter, type: value })}
//     >
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Choose package type" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="lifetime">Lifetime</SelectItem>
//         <SelectItem value="monthly">Monthly</SelectItem>
//         <SelectItem value="all">All</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// };

// const Store: React.FC = () => {
//   const [items, setItems] = useState<Package[]>([]);
//   const [filter, setFilter] = useState<SearchFilters>({ type: "all" });
//   const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize loading state

//   const fetchData = async () => {
//     setIsLoading(true); // Start loading
//     const apiUrl = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/categories?includePackages=1`;
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: { Accept: "application/json" },
//     });
//     const jsonData = await response.json();
//     const pkgA: Package[] = [];

//     jsonData.data.forEach((cat: any) => {
//       cat.packages.forEach((item: any) => {
//         pkgA.push({
//           name: item.name,
//           id: item.id,
//           innerhtml: item.description,
//           imageURL: item.image,
//           price: item.total_price,
//           category: {
//             name: item.category.name,
//             id: item.category.id,
//           },
//         });
//       });
//     });

//     setItems(pkgA);
//     setIsLoading(false); // End loading
//   };

//   useEffect(() => {
//     fetchData().catch(console.error);
//   }, [filter]);

//   const filteredItems = useMemo(() => {
//     if (filter.type === "lifetime") {
//       return items.filter((item) => item.category.name.includes("Lifetime"));
//     } else if (filter.type === "monthly") {
//       return items.filter((item) => item.category.name.includes("Monthly"));
//     } else {
//       return items;
//     }
//   }, [items, filter]);

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <h1 className="text-3xl">Welcome to the Store!</h1>
//       <Filter filter={filter} setFilter={setFilter} />
//       <div className="grid h-screen grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//         {isLoading ? (
//           <div className="col-span-1 flex h-64 items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5">
//             {/* You can put more sophisticated loading indicators here */}
//             <div className="text-lg font-semibold text-gray-400">
//               Loading...
//             </div>
//           </div>
//         ) : (
//           filteredItems.map((item: Package) => (
//             <Pkg size="md" showDesc="showPop" item={item} key={item.id} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Store;
