
import "./App.css";
import { useState } from "react";
import Recipe from "./components/Recipe";
import Alert from "./components/Alert";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Desc from "./components/Desc";
import {ClipLoader} from 'react-spinners';
import { CUISINE_TYPES, HEALTH_LABELS,MEAL_TYPES, NUMBER_OF_RECIPES } from './constants/constants';
import { capitalizeFirstLetter } from "./functions/uppercase";


function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [alert, setAlert] = useState("");
  const [selectedNumber, setSelectedNumber] = useState();
  const [showDesc, setShowDesc] = useState(true);
  const [filterOn, setFilterOn] = useState(false)
  const [cuisineType, setCuisineType] = useState("")
  const [mealType, setMealType] = useState("")
  const [selectedLabel, setSelectedLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const APP_ID = "4248dc5d";
  const APP_KEY = "b2a617bd5fb76e3f8639f858ab36ebca";


  const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}` +
  `${query ? `&q=${query}` : ''}` +
  `${selectedNumber ? `&from=0&to=${selectedNumber}` : `&from=0&to=5`}` + 
  `${cuisineType ? `&cuisineType=${encodeURIComponent(cuisineType)}` : ''}` +
  `${mealType ? `&mealType=${encodeURIComponent(mealType)}` : ''}`+
  `${selectedLabel ? `&selectedLabel=${selectedLabel}` : ''}`;

  const blankQueryUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&random=true`+
  `${selectedNumber ? `&from=0&to=${selectedNumber}` : `&from=0&to=15`}` + 
  `${cuisineType ? `&cuisineType=${encodeURIComponent(cuisineType)}` : ''}` +
  `${mealType ? `&mealType=${encodeURIComponent(mealType)}` : ''}` +
  `${selectedLabel ? `&selectedLabel=${selectedLabel}` : ''}`;


  const allBlankUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&cuisineType=Asian&random=true`

  const getData = async () => {
    if (query !== "") {
      try {
        const result = await Axios.get(url);
        if (!result.data.more) {
          setAlert("No dish with this name.");
          return;
        }
        setRecipes(result.data.hits);
        setAlert("");
        setQuery("");
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlert("Error retrieving data. Please try again.");
      }finally{
        setLoading(false)
      }
    }else if(query === "" &&  (cuisineType !== "" || mealType !== "" || selectedLabel !== "")){
      const result = await Axios.get(blankQueryUrl);
      setRecipes(result.data.hits);
      setLoading(false)
    }else{
      const result = await Axios.get(allBlankUrl);
      setRecipes(result.data.hits);
      setLoading(false)
      
    }
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setShowDesc(false);
    setLoading(true)
    getData();
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelection = (e) => {
    setSelectedNumber(e.target.value);
  };

  const handleCuisine = (e) => {
    setCuisineType(e.target.value)
  }

  const handleFilter = (e) => {
    setFilterOn(!filterOn);

  }

  const handleMealType = (e) => {
    setMealType(e.target.value);
  }

  const handleSelectChange = (e) => {
    setSelectedLabel(e.target.value);
  };
  
  
  return (
    <div className="App">
      <h1>Search Your Meal</h1>
      <form className="search-form" onSubmit={onSubmitSearch}>
        {alert !== "" && <Alert alert={alert} />}
        <input
          type="text"
          placeholder="Search Recipe"
          autoComplete="off"
          onChange={onChange}
          value={query}
        />
        <input type="submit" value="search"  />
        
      </form>
      <div class="button-container">
       <button onClick={handleFilter} className="button">Filters +</button>
        {filterOn !== false && 
        <div className="filter-buttons">
          <label id="numberOfRecipes">Select the number of recipes:</label>
           <select
          className="selection"
          value={selectedNumber}
          onChange={handleSelection}
        >
          {NUMBER_OF_RECIPES.map((number)=>
          <option value={number.value} key={number.value}>
            {number.value}
          </option>)}
        </select>
          <label id="selectedCuisine">Select Cuisine:</label>
        <select
          className="selection"
          value={cuisineType}
          onChange={handleCuisine}
          
        >
          {CUISINE_TYPES.map((cuisine)=>
          <option value={cuisine.value} key={cuisine.value}>
            {capitalizeFirstLetter(cuisine.value)}
          </option>)}
        </select>

        <label htmlFor="healthLabels">Select Health Label:</label>
        <select
          className="selection"
          value={selectedLabel}
          onChange={handleSelectChange}
          id="healthLabels"
        >
          {HEALTH_LABELS.map((label)=> (
            <option key={label.webLabel} value={label.apiParameter}>
              {label.webLabel}
            </option>
          ))}
        </select>
            <label htmlFor="mealType">Select Meal Type:</label>
        <select
          className="selection"
          value={mealType}
          onChange={handleMealType}
        >
          {MEAL_TYPES.map((meal)=>
          <option value={meal.value} key={meal.value}>
            {capitalizeFirstLetter(meal.value)}
          </option>)}
        </select>

        </div>
        }
      </div>


      {showDesc !== false && <Desc />}
      {loading ? 
      <ClipLoader loading={loading} size={200} color="#607274"/> : (
      <div className="recipes">
        {recipes !== [] &&
          recipes.map((recipe) => <Recipe key={uuidv4()} recipe={recipe} />)}
      </div>
      )}
    </div>
  );
}

export default App;
