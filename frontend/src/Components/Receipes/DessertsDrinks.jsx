 
import Recipes from "../../Pages/Recipes";

const recipes = [
  {
    name: "Chocolate Cake",
    desc: "Moist and rich chocolate layered cake.",
    image: "/images/cake.jpg",
  },
  {
    name: "Mango Smoothie",
    desc: "Refreshing drink made with ripe mangoes.",
    image: "/images/smoothie.jpg",
  },
  {
    name: "Ice Cream Sundae",
    desc: "Classic sundae topped with nuts and syrup.",
    image: "/images/sundae.jpg",
  },
];

export default function DessertsDrinks() {
  return (
    <Recipes
      title="Desserts & Drinks"
      description="Sweet treats and refreshing drinks for every mood."
      recipes={recipes}
    />
  );
}
