import { describe, expect, it } from "vitest";
import { getIngredients, normalizeMealId, searchMeals, type Meal } from "@/lib/mealdb";
import { addFavorite, removeFavorite } from "@/lib/favorites";

const meal = (idMeal: string, strMeal: string, extra: Record<string, string | null> = {}): Meal => ({
  idMeal,
  strMeal,
  strCategory: null,
  strArea: null,
  strInstructions: null,
  strMealThumb: null,
  strYoutube: null,
  strSource: null,
  ...extra,
});

const meals = [meal("1", "Chicken Curry"), meal("2", "Curry"), meal("3", "Beef Stew")];

describe("recipe search", () => {
  it("puts the exact name match first, ignoring case and spaces", () => {
    expect(searchMeals(meals, "  CURRY ").map((m) => m.idMeal)).toEqual(["2", "1"]);
  });
  it("finds nothing for an unknown dish", () => {
    expect(searchMeals(meals, "pizza")).toEqual([]);
  });
  it("finds nothing for an empty search", () => {
    expect(searchMeals(meals, "   ")).toEqual([]);
  });
});

describe("recipe links", () => {
  it("accepts old links that had a colon before the id", () => {
    expect(normalizeMealId(":52772")).toBe("52772");
  });
});

describe("ingredients", () => {
  it("lists only filled ingredients with their measures", () => {
    const m = meal("9", "Toast", { strIngredient1: "Bread", strMeasure1: "2 slices", strIngredient2: "", strIngredient3: "Butter", strMeasure3: " " });
    expect(getIngredients(m)).toEqual([
      { ingredient: "Bread", measure: "2 slices" },
      { ingredient: "Butter", measure: "" },
    ]);
  });
});

describe("favorites", () => {
  it("does not add the same meal twice", () => {
    expect(addFavorite([meals[0]!], meals[0]!)).toBeNull();
  });
  it("removes a saved meal and reports when it was not saved", () => {
    expect(removeFavorite([meals[0]!, meals[1]!], "1")?.map((m) => m.idMeal)).toEqual(["2"]);
    expect(removeFavorite([meals[1]!], "1")).toBeNull();
  });
});

import { STARTER_SECTIONS, findLocalRecipe } from "@/data/starter-recipes";

describe("starter recipes", () => {
  it("shows African favourites before everyday basics", () => {
    expect(STARTER_SECTIONS[0]?.title).toBe("African favourites");
    expect(STARTER_SECTIONS[1]?.title).toBe("Everyday basics");
  });
  it("includes rice and sushi in everyday basics", () => {
    const names = STARTER_SECTIONS[1]!.recipes.map((r) => r.strMeal);
    expect(names).toContain("Sushi");
    expect(names.some((n) => n.toLowerCase().includes("rice"))).toBe(true);
  });
  it("opens the app's own recipes by id with their ingredients", () => {
    const jollof = findLocalRecipe("local-jollof-rice");
    expect(jollof?.strMeal).toBe("Jollof Rice");
    expect(getIngredients(jollof!).length).toBe(12);
  });
});
