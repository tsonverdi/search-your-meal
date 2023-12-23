import React from "react";
import { v4 as uuidv4 } from "uuid";

const RecipeDetails = ({ ingredients }) => {
  return (
    <div className={`ingredient-container`}>
      {ingredients.map((ingredient) => (
        <ul className="ingredient-list" key={uuidv4()}>
          <li className="ingredient-text">{ingredient.text}</li>
        </ul>
      ))}
    </div>
  );
};

export default RecipeDetails;
