// 📁 src/api/recipeApi.js
import { API } from "./api";

/**
 * 🥘 Recipes API
 * All requests automatically use BASE_URL from .env (through API instance)
 */

// 📜 Get all recipes (with optional subcategory filter)
export const getRecipes = (subcategorySlug) => {
  if (subcategorySlug) {
    return API.get(`/recipes?subcategory=${subcategorySlug}`);
  }
  return API.get("/recipes");
};

// 📄 Get a single recipe by ID
export const getRecipeById = (id) => {
  return API.get(`/recipes/${id}`);
};

// 🌐 Get a recipe by slug (for public display)
export const getRecipeBySlug = (slug) => {
  return API.get(`/recipes/slug/${slug}`);
};

// ✨ Create a new recipe (multipart/form-data for image upload)
export const createRecipe = (formData) => {
  return API.post("/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📝 Update recipe by ID (multipart/form-data)
export const updateRecipe = (id, formData) => {
  return API.put(`/recipes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🗑️ Delete recipe by ID
export const deleteRecipe = (id) => {
  return API.delete(`/recipes/${id}`);
};
