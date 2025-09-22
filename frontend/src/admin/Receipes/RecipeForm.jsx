import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, createRecipe, updateRecipe } from "../api/recipesApi";
import { API as api } from "../api/api"; // rename API to api
// for subcategories
import ImageUploader from "./ImageUploader";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [images, setImages] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");

  useEffect(() => {
    // Load recipe if editing
    if (id && id !== "new") {
      getRecipeById(id).then((res) => {
        const r = res.data;
        setTitle(r.title || "");
        setIngredients((r.ingredients || []).join("\n"));
        setSteps((r.steps || []).join("\n"));
        setImages(r.images || []);
        setSubcategoryId(r.subcategory_id || "");
      });
    }

    // Load recipe subcategories
    api.get("/subcategories?category=recipes").then((res) => {
      setSubcategories(res.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    formData.append("subcategory_id", subcategoryId); // ✅ send subcategory _id

    let fileIndex = 0;
    images.forEach((img) => {
      if (img instanceof File) {
        if (fileIndex >= 5) return;
        formData.append(`image_${fileIndex}`, img);
        fileIndex++;
      } else {
        formData.append("existingImages", img);
      }
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
        <ImageUploader images={images} onChange={setImages} />

        {/* Submit */}
        <div>
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
``