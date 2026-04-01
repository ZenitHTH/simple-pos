import * as data from "./data";
import {
  AppSettings,
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

// In-memory state for mock data
let categories = [...data.mockCategories];
let products = [...data.mockProducts];
let materials = [...data.mockMaterials];
let recipeLists = [...data.mockRecipeLists];
let recipeItems = [...data.mockRecipeItems];
let customers = [...data.mockCustomers];
let stocks = [...data.mockStocks];
let images = [...data.mockImages];
let productImages = [...data.mockProductImages];
let receiptLists = [...data.mockReceiptLists];
let receipts = [...data.mockReceipts];

// In-memory settings state (simulates file persistence within the browser session)
let mockSettings: AppSettings = {
  currency_symbol: "฿",
  tax_enabled: true,
  tax_rate: 7.0,
  display_scale: 100.0,
  layout_max_width: 1280.0,
  sidebar_scale: 100.0,
  cart_scale: 100.0,
  grid_scale: 1,
  manage_table_scale: 1,
  theme_primary_color: null,
  stock_table_scale: 100.0,
  material_table_scale: 100.0,
  category_table_scale: 100.0,
  setting_page_scale: 100.0,
  payment_modal_scale: 100.0,
  header_font_scale: 100.0,
  sidebar_font_scale: 100.0,
  cart_font_scale: 100.0,
  grid_font_scale: 100.0,
  manage_table_font_scale: 100.0,
  stock_table_font_scale: 100.0,
  material_table_font_scale: 100.0,
  category_table_font_scale: 100.0,
  setting_page_font_scale: 100.0,
  payment_modal_font_scale: 100.0,
  history_font_scale: 100.0,
  button_scale: 100.0,
  button_font_scale: 100.0,
  theme_radius: 0.5,
  payment_numpad_height: 320,
  cart_item_font_size: 100,
  cart_item_header_font_size: 100,
  cart_item_price_font_size: 100,
  cart_item_padding: 10,
  cart_item_margin: 8,
  typography_font_family: null,
  typography_base_size: null,
  typography_heading_weight: null,
  typography_body_weight: null,
  typography_line_height: null,
  typography_letter_spacing: null,
  image_storage_path: null,
  db_storage_path: null,
};

export const handlers = {
  // Categories
  get_categories: () => categories,
  create_category: ({ name }: { name: string }) => {
    const newCat: Category = {
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      name,
    };
    categories.push(newCat);
    return newCat;
  },
  update_category: ({ id, name }: { id: number; name: string }) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) cat.name = name;
    return cat;
  },
  delete_category: ({ id }: { id: number }) => {
    categories = categories.filter((c) => c.id !== id);
  },

  // Products
  get_products: () => products,
  create_product: ({
    title,
    categoryId,
    satang,
  }: {
    title: string;
    categoryId: number;
    satang: number;
  }) => {
    const newId = Math.max(0, ...products.map((p) => p.product_id)) + 1;
    const newProduct: BackendProduct = {
      product_id: newId,
      title,
      category_id: categoryId,
      satang,
      use_recipe_stock: false,
    };
    products.push(newProduct);
    // Also create initial empty stock
    stocks.push({
      stock_id: Math.max(0, ...stocks.map((s) => s.stock_id)) + 1,
      product_id: newId,
      quantity: 0,
    });
    return newProduct;
  },
  update_product: ({
    id,
    title,
    categoryId,
    satang,
  }: {
    id: number;
    title: string;
    categoryId: number;
    satang: number;
  }) => {
    const product = products.find((p) => p.product_id === id);
    if (product) {
      product.title = title;
      product.category_id = categoryId;
      product.satang = satang;
    }
    return product;
  },
  delete_product: ({ id }: { id: number }) => {
    // Check if product is in any receipts
    const hasReceipts = receipts.some((r) => r.product_id === id);
    if (hasReceipts) {
      throw new Error(
        "Cannot delete product: it is currently referenced in past receipts. Try archiving instead.",
      );
    }

    products = products.filter((p) => p.product_id !== id);
    stocks = stocks.filter((s) => s.product_id !== id);
    productImages = productImages.filter((pi) => pi.product_id !== id);
  },
  set_product_stock_mode: ({
    id,
    useRecipe,
  }: {
    id: number;
    useRecipe: boolean;
  }) => {
    const product = products.find((p) => p.product_id === id);
    if (product) product.use_recipe_stock = useRecipe;
  },

  // Materials
  get_materials: () => materials,
  create_material: ({
    name,
    type,
    volume,
    quantity,
  }: {
    name: string;
    type: string;
    volume: number;
    quantity: number;
  }) => {
    const newMaterial: Material = {
      id: Math.max(0, ...materials.map((m) => m.id)) + 1,
      name,
      type_: type,
      volume,
      precision: 4,
      quantity,
    };
    materials.push(newMaterial);
    return newMaterial;
  },
  update_material: ({
    id,
    name,
    type,
    volume,
    quantity,
  }: {
    id: number;
    name: string;
    type: string;
    volume: number;
    quantity: number;
  }) => {
    const material = materials.find((m) => m.id === id);
    if (material) {
      material.name = name;
      material.type_ = type;
      material.volume = volume;
      material.quantity = quantity;
    }
    return material;
  },
  delete_material: ({ id }: { id: number }) => {
    const count = materials.length;
    materials = materials.filter((m) => m.id !== id);
    recipeItems = recipeItems.filter((ri) => ri.material_id !== id);
    return count - materials.length;
  },

  // Recipes
  get_recipe_list_by_product: ({ productId }: { productId: number }) => {
    return recipeLists.find((l) => l.product_id === productId) || null;
  },
  create_recipe_list: ({ productId }: { productId: number }) => {
    const newList: RecipeList = {
      id: Math.max(0, ...recipeLists.map((l) => l.id)) + 1,
      product_id: productId,
    };
    recipeLists.push(newList);
    return newList;
  },
  delete_recipe_list: ({ listId }: { listId: number }) => {
    const count = recipeLists.length;
    recipeLists = recipeLists.filter((l) => l.id !== listId);
    recipeItems = recipeItems.filter((i) => i.recipe_list_id !== listId);
    return count - recipeLists.length;
  },
  get_recipe_items: ({ recipeListId }: { recipeListId: number }) => {
    return recipeItems.filter((i) => i.recipe_list_id === recipeListId);
  },
  add_recipe_item: ({
    recipeListId,
    materialId,
    volumeUse,
    unit,
  }: {
    recipeListId: number;
    materialId: number;
    volumeUse: number;
    unit: string;
  }) => {
    const newItem: RecipeItem = {
      id: Math.max(0, ...recipeItems.map((i) => i.id)) + 1,
      recipe_list_id: recipeListId,
      material_id: materialId,
      volume_use: volumeUse,
      volume_use_precision: 4,
      unit,
    };
    recipeItems.push(newItem);
    return newItem;
  },
  update_recipe_item: ({
    itemId,
    volumeUse,
    unit,
  }: {
    itemId: number;
    volumeUse: number;
    unit: string;
  }) => {
    const item = recipeItems.find((i) => i.id === itemId);
    if (item) {
      item.volume_use = volumeUse;
      item.unit = unit;
    }
    return item;
  },
  delete_recipe_item: ({ itemId }: { itemId: number }) => {
    const count = recipeItems.length;
    recipeItems = recipeItems.filter((i) => i.id !== itemId);
    return count - recipeItems.length;
  },

  // Customers
  get_customers: () => customers,
  create_customer: (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      id: Math.max(0, ...customers.map((c) => c.id)) + 1,
      ...customer,
      branch: customer.branch || "00000",
    };
    customers.push(newCustomer);
    return newCustomer;
  },
  update_customer: (customer: Customer) => {
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      customers[index] = {
        ...customer,
        branch: customer.branch || "00000",
      };
    }
    return customers[index];
  },

  // Stocks
  get_all_stocks: () => stocks,
  get_stock: ({ productId }: { productId: number }) => {
    return stocks.find((s) => s.product_id === productId) || null;
  },
  insert_stock: ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    const existing = stocks.find((s) => s.product_id === productId);
    if (existing) {
      existing.quantity += quantity;
      return existing;
    }
    const newStock = {
      stock_id: Math.max(0, ...stocks.map((s) => s.stock_id)) + 1,
      product_id: productId,
      quantity,
    };
    stocks.push(newStock);
    return newStock;
  },
  update_stock: ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    const existing = stocks.find((s) => s.product_id === productId);
    if (existing) {
      existing.quantity = quantity;
      return existing;
    }
    const newStock = {
      stock_id: Math.max(0, ...stocks.map((s) => s.stock_id)) + 1,
      product_id: productId,
      quantity,
    };
    stocks.push(newStock);
    return newStock;
  },
  remove_stock: ({ stockId }: { stockId: number }) => {
    const count = stocks.length;
    stocks = stocks.filter((s) => s.stock_id !== stockId);
    return count - stocks.length;
  },

  // Images
  save_image: ({ filename }: { filename: string }) => {
    const newImage: Image = {
      id: Math.max(0, ...images.map((i) => i.id)) + 1,
      file_name: filename,
      file_hash: Math.random().toString(36).substring(7),
      file_path: `/mock/images/${filename}`,
      created_at: new Date().toISOString(),
    };
    images.push(newImage);
    return newImage;
  },
  link_product_image: ({
    productId,
    imageId,
  }: {
    productId: number;
    imageId: number;
  }) => {
    const newLink = { product_id: productId, image_id: imageId };
    productImages.push(newLink);
    return newLink;
  },
  unlink_product_image: ({
    productId,
    imageId,
  }: {
    productId: number;
    imageId: number;
  }) => {
    const count = productImages.length;
    productImages = productImages.filter(
      (pi) => !(pi.product_id === productId && pi.image_id === imageId),
    );
    return count - productImages.length;
  },
  get_product_images: ({ productId }: { productId: number }) => {
    const imageIds = productImages
      .filter((pi) => pi.product_id === productId)
      .map((pi) => pi.image_id);
    return images.filter((img) => imageIds.includes(img.id));
  },
  get_all_images: () => images,
  delete_image: ({ imageId }: { imageId: number }) => {
    images = images.filter((img) => img.id !== imageId);
    productImages = productImages.filter((pi) => pi.image_id !== imageId);
  },
  get_all_image_links: () => productImages,

  // Receipts
  create_invoice: ({ customerId }: { customerId?: number }) => {
    const newId = Math.max(0, ...receiptLists.map((r) => r.receipt_id)) + 1;
    const newList: ReceiptList = {
      receipt_id: newId,
      datetime_unix: Math.floor(Date.now() / 1000),
      customer_id: customerId,
    };
    receiptLists.push(newList);
    return newList;
  },
  add_invoice_item: ({
    receiptId,
    productId,
    quantity,
  }: {
    receiptId: number;
    productId: number;
    quantity: number;
  }) => {
    const product = products.find((p) => p.product_id === productId);
    const newItem: Receipt = {
      id: Math.max(0, ...receipts.map((r) => r.id)) + 1,
      receipt_id: receiptId,
      product_id: productId,
      quantity,
      satang_at_sale: product ? product.satang : 0,
    };
    receipts.push(newItem);
    return newItem;
  },
  get_invoice_detail: ({ receiptId }: { receiptId: number }) => {
    const list = receiptLists.find((r) => r.receipt_id === receiptId);
    const items = receipts.filter((r) => r.receipt_id === receiptId);
    return [list, items];
  },
  get_invoices_by_date: ({
    startUnix,
    endUnix,
  }: {
    startUnix: number;
    endUnix: number;
  }) => {
    return receiptLists.filter(
      (r) => r.datetime_unix >= startUnix && r.datetime_unix <= endUnix,
    );
  },
  export_receipts: () => "mock_export_path.csv",

  // Settings & Database (Minimal mocks)
  get_settings: () => mockSettings,
  save_settings: ({ settings }: { settings: AppSettings }) => {
    mockSettings = { ...settings };
  },
  get_db_status: () => ({ is_connected: true, is_encrypted: true }),
  check_db_password: () => true,
  check_database_exists: () => true,
  initialize_database: () => Promise.resolve(),
  get_storage_info: () => ({
    database_path: "/mock/db.sqlite",
    image_path: "/mock/images",
  }),
};
