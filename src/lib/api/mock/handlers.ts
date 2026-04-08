import { categoryHandlers } from "./handlers/categories";
import { productHandlers } from "./handlers/products";
import { materialHandlers } from "./handlers/materials";
import { recipeHandlers } from "./handlers/recipes";
import { customerHandlers } from "./handlers/customers";
import { stockHandlers } from "./handlers/stocks";
import { imageHandlers } from "./handlers/images";
import { receiptHandlers } from "./handlers/receipts";
import { settingHandlers } from "./handlers/settings";

export const handlers = {
  ...categoryHandlers,
  ...productHandlers,
  ...materialHandlers,
  ...recipeHandlers,
  ...customerHandlers,
  ...stockHandlers,
  ...imageHandlers,
  ...receiptHandlers,
  ...settingHandlers,
};
