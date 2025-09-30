import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, createRecipe, updateRecipe } from "../api/recipesApi";
import { API as api } from "../api/api";
import ImageUploader from "./ImageUploader";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [images, setImages] = useState([]); // string names or File objects
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        let recipeData = null;

        // fetch recipe (if editing)
        if (id && id !== "new") {
          const res = await getRecipeById(id);
          recipeData = res.data;
          setTitle(recipeData.title || "");
          setIngredients((recipeData.ingredients || []).join("\n"));
          setSteps((recipeData.steps || []).join("\n"));
          setImages(recipeData.images || []);
        }

        // fetch subcategories for recipes
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

    // add existing images as JSON
    const existing = images.filter((img) => typeof img === "string");
    if (existing.length) {
      formData.append("existingImages", JSON.stringify(existing));
    }

    // add new files
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
      navigate("/admin/recipes"); // go back after save
    } catch (err) {
      console.error("Recipe submit error:", err);
      alert("Error saving recipe");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Add Recipe" : "Edit Recipe"}
      </h1>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="border rounded w-full px-3 py-2"
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          <textarea
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-1">Steps</label>
          <textarea
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Images */}
        <ImageUploader
          images={images}
          onChange={setImages}
          backendUrl={BACKEND_URL}
        />

        {/* Submit & Cancel */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/recipes")}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Recipe
          </button>
        </div>
      </form>
    </div>
  );
}
