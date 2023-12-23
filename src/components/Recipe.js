import React, { useState } from "react";
import RecipeDetails from "./RecipeDetails";

const Recipe = ({ recipe }) => {
  const [show, setShow] = useState(false);

  const { label, image, url, ingredients, source, cuisineType,mealType } = recipe.recipe;

  return (
    <div className="recipe">
      <h2>{label}</h2>
      <img src={image} alt={label} />
      <h3 className="cuisine-type">{cuisineType[0]} Cuisine</h3>
      <h5 className="cuisine-type">{mealType[0]}</h5>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Check Full Recipe in "{source}"
      </a>
      <button onClick={() => setShow(!show)}>Ingredients</button>
      {show && <RecipeDetails ingredients={ingredients} />}
      {/* You can add more details or actions here */}
    </div>
  );
};

export default Recipe;
