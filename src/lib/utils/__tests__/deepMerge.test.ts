import { deepMerge } from "../deepMerge";

describe("deepMerge", () => {
  it("should clone arrays instead of sharing references", () => {
    const source = { items: [1, 2, 3] };
    const target = { items: [] };
    const result = deepMerge<{ items: number[] }>(target, source);

    expect(result.items).toEqual([1, 2, 3]);
    expect(result.items).not.toBe(source.items);
  });

  it("should merge nested objects", () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = deepMerge<any>(target, source);
    expect(result.a).toEqual({ b: 1, c: 2 });
  });
});
