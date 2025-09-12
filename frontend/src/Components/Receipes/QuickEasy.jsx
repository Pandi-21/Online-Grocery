 
import { dummyRecipes } from "../../data/dummyRecipes";
import Recipes from "../../Pages/Recipes";

export default function QuickEasy() {
  return (
    <Recipes
      title="Quick & Easy Recipes"
      description="Fast meals ready in 30 minutes or less."
      recipes={dummyRecipes.quickEasy}
      type="quickEasy"   // 👈 IMPORTANT
    />
  );
}
