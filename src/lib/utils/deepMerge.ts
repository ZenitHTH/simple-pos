/**
 * Deep merges two objects. 
 * Note: Arrays in the source object replace arrays in the target object (they are not merged).
 */
export function deepMerge<T>(target: any, source: any): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key]
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result as T;
}
