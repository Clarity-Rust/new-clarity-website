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
  const [categories, setCategories] = useState<Category[]>([]);
  // useeffect hook to only get events category
  // replace dropdown with populated state of streamers

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
        (cat: any) => cat.parent !== null && cat.parent.name === "Event"
      );
      setCategories(categoriesData);

      // Automatically set filter to the first category if not already set
      if (categories.length > 0 && filter.server === "") {
        setFilter({ ...filter, server: categories[0].id });
      }
    };

    fetchData().catch(console.error);
  }, [filter, setFilter]);

  return (
    <div className="flex gap-2 justify-center">
      <h2>Filter by streamer: </h2>
      <Select
        value={filter.server}
        onValueChange={(value) => setFilter({ ...filter, server: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose package type" />
        </SelectTrigger>
        <SelectContent className="dark">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const EventStore: React.FC = () => {
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
        Welcome to the Clarity Rust Event Store!
      </h1>
      <p className="w-1/2 font-medium">
        Here you can purchase packages during events to support your favorite
        streamers. Packages are sorted by streamer name. (add better description
        here)
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
              showChecks={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventStore;
