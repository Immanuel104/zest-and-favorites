import type { Meal } from "@/lib/mealdb";
import jollofImg from "@/assets/recipes/jollof-rice.jpg";
import pilauImg from "@/assets/recipes/kenyan-pilau.jpg";
import chapatiImg from "@/assets/recipes/chapati.jpg";
import githeriImg from "@/assets/recipes/githeri.jpg";

/**
 * Recipes that live in this app (not in TheMealDB). Ids start with "local-"
 * so they never clash with TheMealDB ids. Add new house recipes here.
 */
type LocalRecipe = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  strYoutube?: string;
  strSource?: string;
  ingredients: [ingredient: string, measure: string][];
};

function toMeal(r: LocalRecipe): Meal {
  const meal: Meal = {
    idMeal: r.idMeal,
    strMeal: r.strMeal,
    strCategory: r.strCategory,
    strArea: r.strArea,
    strMealThumb: r.strMealThumb,
    strInstructions: r.strInstructions,
    strYoutube: r.strYoutube ?? null,
    strSource: r.strSource ?? null,
  };
  r.ingredients.forEach(([ingredient, measure], i) => {
    meal[`strIngredient${i + 1}`] = ingredient;
    meal[`strMeasure${i + 1}`] = measure;
  });
  return meal;
}

const LOCAL_RECIPE_DATA: LocalRecipe[] = [
  {
    idMeal: "local-jollof-rice",
    strMeal: "Jollof Rice",
    strCategory: "Rice",
    strArea: "Nigerian",
    strMealThumb: jollofImg,
    strYoutube: "https://www.youtube.com/results?search_query=nigerian+jollof+rice",
    ingredients: [
      ["Long grain parboiled rice", "3 cups"],
      ["Plum tomatoes", "4"],
      ["Red bell peppers", "2"],
      ["Scotch bonnet pepper", "1"],
      ["Onions", "2"],
      ["Tomato paste", "3 tbsp"],
      ["Vegetable oil", "1/3 cup"],
      ["Chicken stock", "3 cups"],
      ["Curry powder", "1 tsp"],
      ["Dried thyme", "1 tsp"],
      ["Bay leaves", "2"],
      ["Salt", "to taste"],
    ],
    strInstructions: `Blend the tomatoes, bell peppers, scotch bonnet and one onion until smooth.
Heat the oil in a heavy pot and fry the second onion (sliced) until soft. Stir in the tomato paste and fry for 3 minutes.
Pour in the blended pepper mix and cook on medium heat for 15–20 minutes, stirring, until thick and the oil rises to the top.
Add the curry powder, thyme, bay leaves, salt and the stock. Bring to a boil.
Wash the rice, add it to the pot and stir once. Cover tightly (foil under the lid helps) and cook on low heat for 25–30 minutes until the rice is soft and has absorbed the sauce.
Fluff with a fork and serve with fried plantain, chicken or salad. A little crust at the bottom of the pot is the "party" taste.`,
  },
  {
    idMeal: "local-kenyan-pilau",
    strMeal: "Kenyan Beef Pilau",
    strCategory: "Rice",
    strArea: "Kenyan",
    strMealThumb: pilauImg,
    strYoutube: "https://www.youtube.com/results?search_query=kenyan+beef+pilau",
    ingredients: [
      ["Basmati rice", "3 cups"],
      ["Beef, cubed", "500 g"],
      ["Onions", "2 large"],
      ["Garlic", "4 cloves"],
      ["Ginger", "1 thumb"],
      ["Pilau masala", "2 tbsp"],
      ["Cumin seeds", "1 tsp"],
      ["Tomatoes", "2"],
      ["Vegetable oil", "3 tbsp"],
      ["Water or beef stock", "4½ cups"],
      ["Salt", "to taste"],
    ],
    strInstructions: `Boil the beef with a pinch of salt until tender (about 40 minutes). Keep the cooking water as stock.
Heat the oil and fry the sliced onions slowly until deep brown — this gives pilau its colour.
Add the cumin seeds, crushed garlic and ginger and fry for 1 minute, then add the pilau masala.
Add the beef and fry for 3 minutes, then the chopped tomatoes until soft.
Add the washed rice and stir to coat, then pour in 4½ cups of the stock. Season with salt.
Bring to a boil, cover and cook on low heat for 20 minutes until the rice is done.
Serve with kachumbari (tomato, onion and coriander salad).`,
  },
  {
    idMeal: "local-chapati",
    strMeal: "Soft Layered Chapati",
    strCategory: "Bread",
    strArea: "Kenyan",
    strMealThumb: chapatiImg,
    strYoutube: "https://www.youtube.com/results?search_query=soft+kenyan+chapati",
    ingredients: [
      ["All-purpose flour", "3 cups"],
      ["Warm water", "1 cup"],
      ["Vegetable oil", "4 tbsp + for frying"],
      ["Sugar", "1 tbsp"],
      ["Salt", "1 tsp"],
    ],
    strInstructions: `Mix the flour, sugar and salt. Add 2 tbsp of oil and the warm water bit by bit and knead for 10 minutes into a soft dough.
Cover and rest for 30 minutes.
Divide into 8 balls. Roll each one thin, brush with oil, roll it up like a rope and coil it into a snail. Rest 10 minutes.
Roll each coil into a flat round.
Cook in a dry hot pan for about 1 minute per side, then brush with a little oil and cook until golden spots appear on both sides.
Stack the chapatis and cover with a cloth to keep them soft. Great with beans, stew or tea.`,
  },
  {
    idMeal: "local-githeri",
    strMeal: "Githeri (Maize & Beans)",
    strCategory: "Vegetarian",
    strArea: "Kenyan",
    strMealThumb: githeriImg,
    strYoutube: "https://www.youtube.com/results?search_query=kenyan+githeri",
    ingredients: [
      ["Dried maize (or 2 tins sweetcorn)", "2 cups"],
      ["Red kidney beans (dried or tinned)", "2 cups"],
      ["Onion", "1"],
      ["Tomatoes", "3"],
      ["Garlic", "2 cloves"],
      ["Carrot", "1"],
      ["Vegetable oil", "2 tbsp"],
      ["Fresh coriander", "a handful"],
      ["Salt", "to taste"],
    ],
    strInstructions: `If using dried maize and beans, soak them overnight, then boil together for 1½–2 hours until soft. Drain. (Tinned ones only need rinsing.)
Heat the oil and fry the chopped onion and garlic until soft.
Add the chopped tomatoes and diced carrot and cook until the tomatoes break down into a sauce.
Add the maize and beans, a splash of water and salt. Simmer for 10 minutes so the flavours mix.
Stir in the chopped coriander and serve hot. Add potatoes or greens to make it a full meal.`,
  },
];

export const LOCAL_RECIPES: Meal[] = LOCAL_RECIPE_DATA.map(toMeal);

export type StarterCard = Pick<Meal, "idMeal" | "strMeal" | "strCategory" | "strArea" | "strMealThumb">;

const fromMealDb: StarterCard[] = [
  { idMeal: "53114", strMeal: "Ugali – Kenyan cornmeal", strCategory: "Breakfast", strArea: "Kenyan", strMealThumb: "https://www.themealdb.com/images/media/meals/smoa3h1762341142.jpg" },
  { idMeal: "53113", strMeal: "Sukuma Wiki", strCategory: "Vegetarian", strArea: "Kenyan", strMealThumb: "https://www.themealdb.com/images/media/meals/60o82j1762341177.jpg" },
  { idMeal: "52967", strMeal: "Home-made Mandazi", strCategory: "Breakfast", strArea: "Kenyan", strMealThumb: "https://www.themealdb.com/images/media/meals/thazgm1555350962.jpg" },
  { idMeal: "52968", strMeal: "Mbuzi Choma (Roasted Goat)", strCategory: "Goat", strArea: "Kenyan", strMealThumb: "https://www.themealdb.com/images/media/meals/cuio7s1555492979.jpg" },
  { idMeal: "53112", strMeal: "Kenyan Beef Curry", strCategory: "Beef", strArea: "Kenyan", strMealThumb: "https://www.themealdb.com/images/media/meals/lqampv1762325397.jpg" },
  { idMeal: "53027", strMeal: "Koshari", strCategory: "Vegetarian", strArea: "Egyptian", strMealThumb: "https://www.themealdb.com/images/media/meals/4er7mj1598733193.jpg" },
  { idMeal: "53025", strMeal: "Ful Medames", strCategory: "Vegetarian", strArea: "Egyptian", strMealThumb: "https://www.themealdb.com/images/media/meals/lvn2d51598732465.jpg" },
  { idMeal: "52963", strMeal: "Shakshuka", strCategory: "Vegetarian", strArea: "Egyptian", strMealThumb: "https://www.themealdb.com/images/media/meals/g373701551450225.jpg" },
  { idMeal: "52850", strMeal: "Chicken Couscous", strCategory: "Chicken", strArea: "Moroccan", strMealThumb: "https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg" },
  { idMeal: "52843", strMeal: "Lamb Tagine", strCategory: "Lamb", strArea: "Moroccan", strMealThumb: "https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg" },
  { idMeal: "52973", strMeal: "Leblebi Soup", strCategory: "Vegetarian", strArea: "Tunisian", strMealThumb: "https://www.themealdb.com/images/media/meals/x2fw9e1560460636.jpg" },
];

const everydayBasics: StarterCard[] = [
  { idMeal: "53033", strMeal: "Japanese gohan rice", strCategory: "Side", strArea: "Japanese", strMealThumb: "https://www.themealdb.com/images/media/meals/kw92t41604181871.jpg" },
  { idMeal: "53506", strMeal: "Rice and Beans", strCategory: "Vegetarian", strArea: null, strMealThumb: "https://www.themealdb.com/images/media/meals/j8c1d51782772399.jpg" },
  { idMeal: "53367", strMeal: "Chicken Fried Rice", strCategory: "Chicken", strArea: "Chinese", strMealThumb: "https://www.themealdb.com/images/media/meals/wuyd2h1765655837.jpg" },
  { idMeal: "53065", strMeal: "Sushi", strCategory: "Seafood", strArea: "Japanese", strMealThumb: "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg" },
];

const card = (m: Meal): StarterCard => ({
  idMeal: m.idMeal,
  strMeal: m.strMeal,
  strCategory: m.strCategory,
  strArea: m.strArea,
  strMealThumb: m.strMealThumb,
});

/** Shown on the home page before anyone searches. African dishes first. */
export const STARTER_SECTIONS: { title: string; recipes: StarterCard[] }[] = [
  { title: "African favourites", recipes: [...LOCAL_RECIPES.map(card), ...fromMealDb] },
  { title: "Everyday basics", recipes: everydayBasics },
];

export function findLocalRecipe(idMeal: string): Meal | null {
  return LOCAL_RECIPES.find((m) => m.idMeal === idMeal) ?? null;
}
