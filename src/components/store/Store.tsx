import { Package, SearchFilters } from "@/types";
import { useState, useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Category } from "@/types";

import Pkg from "./Pkg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filter: React.FC<{
  filter: SearchFilters;
  setFilter: (filter: SearchFilters) => void;
}> = ({ filter, setFilter }) => {
  // const [categories, setCategories] = useState<Category[]>([]);
  const catLookup: Record<string, string> = {
    "2xlifetime": "2639946",
    "2xmonthly": "2634939",
    "5xmonthly": "2651821",
    "5xlifetime": "2651822",
  };

  // useeffect hook to get categories to populate dropdown
  // replace dropdown with populated state of categories (minus the event category)
  // also need to remove packages with category "event" from the items state
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://headless.tebex.io/api/accounts/${
        import.meta.env.VITE_WEBSTORE_IDENT
      }/categories`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const jsonData = await response.json();
      const categoriesData = jsonData.data.filter(
        (cat: any) => cat.name !== "Event"
      );

      // Initialize a local array to accumulate updates
      const newCategories: Category[] = [];
      categoriesData.forEach((cat: any) => {
        if (cat.parent === null) {
          newCategories.push({ id: cat.id, name: cat.name });
        }
      });

      // Update the state once with the accumulated updates
      // setCategories(newCategories);
    };

    // Initialize state to empty at the start of fetchData to prevent duplicates on re-render
    // setCategories([]);

    fetchData().catch(console.error);
  }, []);

  return (
    <div className="flex gap-2">
      <h2> Package Type: </h2>
      <Select
        value={filter.server === "" ? "2639946" : filter.server}
        onValueChange={(value) => setFilter({ ...filter, server: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose category" />
        </SelectTrigger>
        <SelectContent className="dark">
          <SelectItem value={catLookup["2xlifetime"]}>2x Lifetime</SelectItem>
          <SelectItem value={catLookup["2xmonthly"]}>2x Monthly</SelectItem>
          <SelectItem value={catLookup["5xlifetime"]}>5x Lifetime</SelectItem>
          <SelectItem value={catLookup["5xmontly"]}>5x Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const Store: React.FC = () => {
  const [items, setItems] = useState<Package[]>([]);
  const [filter, setFilter] = useState<SearchFilters>({
    type: "all",
    server: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    const apiUrl = `https://headless.tebex.io/api/accounts/${
      import.meta.env.VITE_WEBSTORE_IDENT
    }/categories/${
      filter.server === "" ? "2639946" : filter.server
    }/?includePackages=1`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const jsonData = await response.json();
    const pkgA: Package[] = [];

    jsonData.data.packages.forEach((item: any) => {
      pkgA.push({
        name: item.name,
        id: item.id,
        innerhtml: item.description,
        imageURL: item.image,
        price: item.total_price,
        category: {
          name: item.category.name,
          id: item.category.id,
        },
        type: item.type,
      });
    });

    setItems(pkgA);
    setIsLoading(false); // End loading
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, [filter]);

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-[#292930] p-4 ">
      <h1 className="text-3xl text-white">
        Welcome to the Clarity Rust Store!
      </h1>
      <p className="w-1/2 font-medium">
        Here you can purchase packages to support the server and gain access to
        exclusive perks. We offer monthly and lifetime packages. You can also
        buy one month of a monthly package to try it out before committing to a
        subscription (One-time).
      </p>
      <Filter filter={filter} setFilter={setFilter} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <div className="col-span-1 flex h-64 items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5">
            <div className="text-lg font-semibold text-gray-400">
              <ReloadIcon className="h-20 w-20 animate-spin"></ReloadIcon>
            </div>
          </div>
        ) : (
          items.map((item: Package) => (
            <Pkg
              size="md"
              showDesc="showPop"
              item={item}
              key={item.id}
              showChecks={item.type !== "single"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Store;
