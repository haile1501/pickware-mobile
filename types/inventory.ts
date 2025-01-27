export interface Product {
  _id: number;
  sku: string;
  name: string;
  block: number;
  aisle: number;
  row: number;
  quantity: number;
  unit: string;
  cost: number;
}

export interface InventoryState {
  products: Product[];
  productDetail: Product | null;
  loading: boolean;
  errorMessage: string;
  paginationData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statistics: {
    totalValue: number;
    skuCount: number;
    inventoryItems: number;
  };
}
