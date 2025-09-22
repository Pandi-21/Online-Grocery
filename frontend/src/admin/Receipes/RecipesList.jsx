import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipes, deleteRecipe } from "../api/recipesApi";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes().then((res) => setRecipes(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
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
          {recipes.map((recipe) => (
            <tr key={recipe._id}>
              <td className="border px-4 py-2">
                {recipe.images?.length > 0 && (
                  <img
                    src={`/recipes/uploads/${recipe.images[0]}`}
                    alt={recipe.title}
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
              </td>
              <td className="border px-4 py-2">{recipe.title}</td>
              <td className="border px-4 py-2">
                <Link
                  to={`/admin/recipes/edit/${recipe._id}`}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
