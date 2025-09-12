 
import Recipes from "../../Pages/Recipes";

const recipes = [
  {
    name: "Veggie Stir Fry",
    desc: "Colorful stir-fried vegetables with sauces.",
    image: "/images/stirfry.jpg",
  },
  {
    name: "Chicken Curry",
    desc: "Rich and flavorful Indian-style chicken curry.",
    image: "/images/chicken-curry.jpg",
  },
  {
    name: "Grilled Fish",
    desc: "Light, healthy, and protein-packed grilled fish.",
    image: "/images/fish.jpg",
  },
];

export default function LunchDinner() {
  return (
    <Recipes
      title="Lunch & Dinner"
      description="Delicious and filling meals for your main course."
      recipes={recipes}
    />
  );
}
