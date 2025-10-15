// // src/api/recipesApi.js
// import { API } from "./api";

// // -------- Recipes APIs --------

// // Get all recipes (with optional filters/pagination)
// export const getRecipes = (params = {}) =>
//   API.get("/recipes", { params });

// // Get recipe by ID
// export const getRecipeById = (id) =>
//   API.get(`/recipes/${id}`);

// // Create new recipe (multipart because of image uploads)
// export const createRecipe = (formData) =>
//   API.post("/recipes", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // Update recipe by ID
// export const updateRecipe = (id, formData) =>
//   API.put(`/recipes/${id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // Delete recipe
// export const deleteRecipe = (id) =>
//   API.delete(`/recipes/${id}`);

// // Get recipe by slug (for frontend public display)
// export const getRecipeBySlug = (slug) =>
//   API.get(`/recipes/slug/${slug}`);
