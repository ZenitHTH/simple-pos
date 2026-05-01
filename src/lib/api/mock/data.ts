import {
  BackendProduct,
  Category,
  Material,
  RecipeList,
  RecipeItem,
  Customer,
  Stock,
  Image,
  ProductImage,
  ReceiptList,
  Receipt,
} from "../../types";

export const mockCategories: Category[] = [
  { id: 1, name: "Coffee" },
  { id: 2, name: "Tea" },
  { id: 3, name: "Bakery" },
  { id: 4, name: "Dessert" },
  { id: 5, name: "Merchandise" },
];

export const mockProducts: BackendProduct[] = [
  {
    product_id: 1,
    title: "Iced Americano",
    category_id: 1,
    satang: 45000,
    use_recipe_stock: true,
  },
  {
    product_id: 2,
    title: "Cappuccino",
    category_id: 1,
    satang: 50000,
    use_recipe_stock: true,
  },
  {
    product_id: 3,
    title: "Latte",
    category_id: 1,
    satang: 52500,
    use_recipe_stock: true,
  },
  {
    product_id: 4,
    title: "Matcha Latte",
    category_id: 2,
    satang: 55000,
    use_recipe_stock: true,
  },
  {
    product_id: 5,
    title: "Croissant",
    category_id: 3,
    satang: 37500,
    use_recipe_stock: true,
  },
  {
    product_id: 6,
    title: "Cheesecake",
    category_id: 4,
    satang: 65000,
    use_recipe_stock: false,
  },
  {
    product_id: 7,
    title: "Tote Bag",
    category_id: 5,
    satang: 120000,
    use_recipe_stock: false,
  },
  {
    product_id: 8,
    title: "Coffee Mug",
    category_id: 5,
    satang: 85000,
    use_recipe_stock: false,
  },
];

export const mockMaterials: Material[] = [
  {
    id: 1,
    name: "Coffee Beans",
    type_: "Grams",
    volume: 1000,
    precision: 4,
    quantity: 50,
    tags: [],
  },
  {
    id: 2,
    name: "Milk",
    type_: "Liters",
    volume: 1,
    precision: 4,
    quantity: 20,
    tags: [],
  },
  {
    id: 3,
    name: "Matcha Powder",
    type_: "Grams",
    volume: 500,
    precision: 4,
    quantity: 10,
    tags: [],
  },
  {
    id: 4,
    name: "Sugar Syrup",
    type_: "Milliliters",
    volume: 1000,
    precision: 4,
    quantity: 15,
    tags: [],
  },
  {
    id: 5,
    name: "Flour",
    type_: "Kilograms",
    volume: 20,
    precision: 4,
    quantity: 5,
    tags: [],
  },
  {
    id: 6,
    name: "Butter",
    type_: "Grams",
    volume: 500,
    precision: 4,
    quantity: 30,
    tags: [],
  },
];

export const mockRecipeLists: RecipeList[] = [
  { id: 1, product_id: 1 }, // Americano
  { id: 2, product_id: 2 }, // Cappuccino
  { id: 3, product_id: 3 }, // Latte
  { id: 4, product_id: 4 }, // Matcha Latte
  { id: 5, product_id: 5 }, // Croissant
];

export const mockRecipeItems: RecipeItem[] = [
  // Americano: Coffee Beans
  {
    id: 1,
    recipe_list_id: 1,
    material_id: 1,
    volume_use: 18,
    volume_use_precision: 4,
    unit: "Grams",
  },
  // Cappuccino: Coffee Beans + Milk
  {
    id: 2,
    recipe_list_id: 2,
    material_id: 1,
    volume_use: 18,
    volume_use_precision: 4,
    unit: "Grams",
  },
  {
    id: 3,
    recipe_list_id: 2,
    material_id: 2,
    volume_use: 0.15,
    volume_use_precision: 4,
    unit: "Liters",
  },
  // Latte: Coffee Beans + Milk
  {
    id: 4,
    recipe_list_id: 3,
    material_id: 1,
    volume_use: 18,
    volume_use_precision: 4,
    unit: "Grams",
  },
  {
    id: 5,
    recipe_list_id: 3,
    material_id: 2,
    volume_use: 0.25,
    volume_use_precision: 4,
    unit: "Liters",
  },
  // Matcha Latte: Matcha + Milk
  {
    id: 6,
    recipe_list_id: 4,
    material_id: 3,
    volume_use: 5,
    volume_use_precision: 4,
    unit: "Grams",
  },
  {
    id: 7,
    recipe_list_id: 4,
    material_id: 2,
    volume_use: 0.2,
    volume_use_precision: 4,
    unit: "Liters",
  },
  // Croissant: Flour + Butter
  {
    id: 8,
    recipe_list_id: 5,
    material_id: 5,
    volume_use: 0.1,
    volume_use_precision: 4,
    unit: "Kilograms",
  },
  {
    id: 9,
    recipe_list_id: 5,
    material_id: 6,
    volume_use: 40,
    volume_use_precision: 4,
    unit: "Grams",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    tax_id: "1234567890123",
    address: "123 Main St",
    branch: "00000",
  },
  {
    id: 2,
    name: "Jane Smith",
    tax_id: "9876543210987",
    address: "456 Oak Ave",
    branch: "00001",
  },
  { id: 3, name: "Coffee Lover", tax_id: null, address: null, branch: "00000" },
];

export const mockStocks: Stock[] = [
  { stock_id: 1, product_id: 1, quantity: 100 },
  { stock_id: 2, product_id: 2, quantity: 50 },
  { stock_id: 3, product_id: 3, quantity: 75 },
  { stock_id: 4, product_id: 4, quantity: 30 },
  { stock_id: 5, product_id: 5, quantity: 20 },
  { stock_id: 6, product_id: 6, quantity: 5 },
  { stock_id: 7, product_id: 7, quantity: 10 },
  { stock_id: 8, product_id: 8, quantity: 25 },
];

export const mockImages: Image[] = [
  {
    id: 1,
    file_name: "americano.png",
    file_hash: "ha1",
    file_path: "/mock/images/americano.png",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    file_name: "cappuccino.png",
    file_hash: "hc2",
    file_path: "/mock/images/cappuccino.png",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    file_name: "latte.png",
    file_hash: "hl3",
    file_path: "/mock/images/latte.png",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    file_name: "croissant.png",
    file_hash: "hb4",
    file_path: "/mock/images/croissant.png",
    created_at: new Date().toISOString(),
  },
];

export const mockProductImages: ProductImage[] = [
  { product_id: 1, image_id: 1 },
  { product_id: 2, image_id: 2 },
  { product_id: 3, image_id: 3 },
  { product_id: 5, image_id: 4 },
];

export const mockReceiptLists: ReceiptList[] = [
  { receipt_id: 1, datetime_unix: Math.floor(Date.now() / 1000) - 86400 },
  { receipt_id: 2, datetime_unix: Math.floor(Date.now() / 1000) - 43200 },
];

export const mockReceipts: Receipt[] = [
  { id: 1, receipt_id: 1, product_id: 1, quantity: 2, satang_at_sale: 45000 },
  { id: 2, receipt_id: 1, product_id: 5, quantity: 1, satang_at_sale: 37500 },
  { id: 3, receipt_id: 2, product_id: 2, quantity: 1, satang_at_sale: 50000 },
];
