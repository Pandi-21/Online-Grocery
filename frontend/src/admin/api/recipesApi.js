import { API } from "./api";

// -------- Recipes APIs --------

// Get all recipes (with optional filters/pagination)
export const getRecipes = (subcategorySlug) => {
  if (subcategorySlug) {
    return API.get(`/recipes?subcategory=${subcategorySlug}`);
  }
  return API.get("/recipes");
};
// Get recipe by ID
export const getRecipeById = (id) => {
  return API.get(`/recipes/${id}`);
};

// Get recipe by slug (for frontend public display)
export const getRecipeBySlug = (slug) => {
  return API.get(`/recipes/slug/${slug}`);
};

// Create new recipe (multipart/form-data for images)
export const createRecipe = (formData) => {
  return API.post("/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Update recipe by ID (multipart/form-data)
export const updateRecipe = (id, formData) => {
  return API.put(`/recipes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete recipe by ID
export const deleteRecipe = (id) => {
  return API.delete(`/recipes/${id}`);
};
