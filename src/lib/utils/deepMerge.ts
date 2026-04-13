/**
 * Deep merges two objects. 
 * Note: Arrays in the source object replace arrays in the target object (they are not merged).
 * Objects in the source are cloned to prevent shared state.
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
      // If source[key] is an object but doesn't exist in target, clone it
      result[key] = (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]))
        ? deepMerge({}, source[key])
        : source[key];
    }
  }
  return result as T;
}
