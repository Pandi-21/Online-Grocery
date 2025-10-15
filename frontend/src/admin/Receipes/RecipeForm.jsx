import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, createRecipe, updateRecipe } from "../api/recipesApi";
import { API as api } from "../api/api";
import ImageUploader from "./ImageUploader";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [images, setImages] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let recipeData = null;

        if (id && id !== "new") {
          const res = await getRecipeById(id);
          recipeData = res.data;
          setTitle(recipeData.title || "");
          setIngredients((recipeData.ingredients || []).join("\n"));
          setSteps((recipeData.steps || []).join("\n"));
          setImages(recipeData.images || []);
        }

        const subRes = await api.get("/subcategories?category=recipes");
        const subResData = subRes.data;
        setSubcategories(subResData);

        if (recipeData) {
          if (recipeData.subcategory_id) {
            setSubcategoryId(recipeData.subcategory_id);
          } else if (recipeData.subcategory_slug) {
            const match = subResData.find(
              (s) => s.slug === recipeData.subcategory_slug
            );
            setSubcategoryId(match ? match._id : "");
          }
        }
      } catch (err) {
        console.error("Error loading recipe form:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    formData.append("subcategory_id", subcategoryId);

    const existing = images.filter((img) => typeof img === "string");
    if (existing.length) {
      formData.append("existingImages", JSON.stringify(existing));
    }

    images
      .filter((img) => img instanceof File)
      .forEach((file, idx) => {
        if (idx < 5) formData.append(`image_${idx}`, file);
      });

    try {
      if (id && id !== "new") {
        await updateRecipe(id, formData);
      } else {
        await createRecipe(formData);
      }
      navigate("/admin/recipes");
    } catch (err) {
      console.error("Recipe submit error:", err);
      alert("Error saving recipe");
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <p className="text-gray-500 animate-pulse">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {id === "new" ? "Add New Recipe" : "Edit Recipe"}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/admin/recipes")}
            className="text-gray-500 hover:text-gray-700 text-sm transition"
          >
            ← Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter recipe title..."
              required
            />
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select a Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients
            </label>
            <textarea
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="List ingredients (one per line)..."
            />
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps
            </label>
            <textarea
              rows={4}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Describe the steps (one per line)..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Images
            </label>
            <ImageUploader
              images={images}
              onChange={setImages}
              backendUrl={BACKEND_URL}
            />
            <p className="text-xs text-gray-400 mt-1">
              You can upload up to 5 images.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/admin/recipes")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
