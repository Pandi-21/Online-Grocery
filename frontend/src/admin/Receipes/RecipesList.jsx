import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipes, deleteRecipe } from "../api/recipesApi";
import { Pencil, Trash2 } from "lucide-react"; // icons

const BACKEND_URL =import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getRecipes().then((res) => setRecipes(res.data));
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    await deleteRecipe(deleteId);
    setRecipes((prev) => prev.filter((r) => r._id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          to="/admin/recipes/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Recipe
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Image</th>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
       <tbody>
  {recipes.map((recipe, index) => (
    <tr key={recipe._id || index}>
      <td className="border px-4 py-2">
        {Array.isArray(recipe.images) && recipe.images.length > 0 && (
          <img
            key={recipe.images[0]} // safe key for image
            src={`${BACKEND_URL}/recipes/uploads/${recipe.images[0]}`}
            alt={recipe.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
      </td>
      <td className="border px-4 py-2">{recipe.title}</td>
      <td className="border px-4 py-2">
        <Link
          to={`/admin/recipes/edit/${recipe._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
          title="Edit"
        >
          <Pencil className="w-5 h-5" />
        </Link>

        <button
          onClick={() => confirmDelete(recipe._id)}
          className="inline-flex items-center text-red-600 hover:text-red-800"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this recipe?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
