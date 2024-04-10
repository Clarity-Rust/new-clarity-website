export interface Category {
  name: string;
  id: string;
  desc?: string;
}
export interface Package {
  id: string;
  innerhtml: string;
  name: string;
  imageURL: string;
  price: string;
  category?: Category;
  discount?: string;
  tax?: string;
  type: string;
}

export interface Gift {
  package_id: string;
  gift_username_id: string;
  gift_username: string;
}

export interface Basket {
  packages?: string[];
  id: string;
  checkoutURL: string;
  username: string;
  price: number;
  ip: string;
}

export interface User {
  name: string;
  id: string;
}

export interface SharedState {
  basketIdent: string;
  username: string;
  checkoutURL: string;
  authenticated: boolean;
  authURL: string;
  packages: string[];
}

export interface PkgProps {
  size: "sm" | "md" | "lg" | "wide";
  showDesc: "hidden" | "showPop";
  item: Package;
}

export interface SearchFilters {
  type: string;
  sort?: "asc" | "desc";
  sortBy?: "price";
  server: string;
}
