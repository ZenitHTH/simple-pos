import { state } from "../state";
import { Category } from "../../types";

export const categoryHandlers = {
  get_categories: () => state.categories,
  create_category: ({ name }: { name: string }) => {
    const newCat: Category = {
      id: Math.max(0, ...state.categories.map((c) => c.id)) + 1,
      name,
    };
    state.categories.push(newCat);
    return newCat;
  },
  update_category: ({ id, name }: { id: number; name: string }) => {
    const cat = state.categories.find((c) => c.id === id);
    if (cat) cat.name = name;
    return cat;
  },
  delete_category: ({ id }: { id: number }) => {
    state.categories = state.categories.filter((c) => c.id !== id);
  },
};
