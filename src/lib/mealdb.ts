import "server-only";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealIngredient {
  ingredient: string;
  measure: string;
}

export interface Meal extends MealSummary {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string | null;
  ingredients: MealIngredient[];
}

interface CategoriesResponse {
  categories: MealCategory[] | null;
}

interface MealsResponse {
  meals: Record<string, string | null>[] | null;
}

type MealRecord = Record<string, string | null>;

async function fetchMealDB<T>(
  path: string,
  revalidate: number,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(
      `TheMealDB request failed (${response.status} ${response.statusText}) for ${path}`,
    );
  }

  return response.json() as Promise<T>;
}

function normalizeMeal(record: MealRecord): Meal {
  const ingredients: MealIngredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = record[`strIngredient${index}`]?.trim();
    const measure = record[`strMeasure${index}`]?.trim();

    if (ingredient) {
      ingredients.push({ ingredient, measure: measure ?? "" });
    }
  }

  return {
    idMeal: record.idMeal ?? "",
    strMeal: record.strMeal ?? "",
    strMealThumb: record.strMealThumb ?? "",
    strCategory: record.strCategory ?? "",
    strArea: record.strArea ?? "",
    strInstructions: record.strInstructions ?? "",
    strTags: record.strTags,
    strYoutube: record.strYoutube,
    ingredients,
  };
}

export async function getCategories(): Promise<MealCategory[]> {
  const data = await fetchMealDB<CategoriesResponse>("categories.php", 86_400);
  return data.categories ?? [];
}

export async function getMealsByCategory(
  category: string,
): Promise<MealSummary[]> {
  const data = await fetchMealDB<MealsResponse>(
    `filter.php?c=${encodeURIComponent(category)}`,
    3_600,
  );
  return (data.meals ?? []).map((meal) => ({
    idMeal: meal.idMeal ?? "",
    strMeal: meal.strMeal ?? "",
    strMealThumb: meal.strMealThumb ?? "",
  }));
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const data = await fetchMealDB<MealsResponse>(
    `search.php?s=${encodeURIComponent(query)}`,
    3_600,
  );
  return (data.meals ?? []).map((meal) => ({
    idMeal: meal.idMeal ?? "",
    strMeal: meal.strMeal ?? "",
    strMealThumb: meal.strMealThumb ?? "",
  }));
}

export async function getMeal(id: string): Promise<Meal | null> {
  const data = await fetchMealDB<MealsResponse>(
    `lookup.php?i=${encodeURIComponent(id)}`,
    3_600,
  );
  const record = data.meals?.[0];
  return record ? normalizeMeal(record) : null;
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await fetchMealDB<MealsResponse>("random.php", 0);
  const record = data.meals?.[0];
  return record ? normalizeMeal(record) : null;
}
