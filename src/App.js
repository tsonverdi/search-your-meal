
import "./App.css";
import { useState } from "react";
import Recipe from "./components/Recipe";
import Alert from "./components/Alert";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Desc from "./components/Desc";
import {ClipLoader} from 'react-spinners';


function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [alert, setAlert] = useState("");
  const [selectedNumber, setSelectedNumber] = useState();
  const [showDesc, setShowDesc] = useState(true);
  const [filterOn, setFilterOn] = useState(false)
  const [cuisineType, setCuisineType] = useState("")
  const [mealType, setMealType] = useState("")
  const [loading, setLoading] = useState(false);

  const APP_ID = "4248dc5d";
  const APP_KEY = "b2a617bd5fb76e3f8639f858ab36ebca";


  const url = `https://api.edamam.com/search?app_id=${APP_ID}&app_key=${APP_KEY}` +
  `${query ? `&q=${query}` : ''}` +
  `${selectedNumber ? `&from=0&to=${selectedNumber}` : `&from=0&to=5`}` + 
  `${cuisineType ? `&cuisineType=${encodeURIComponent(cuisineType)}` : ''}` +
  `${mealType ? `&mealType=${encodeURIComponent(mealType)}` : ''}`;



  const getData = async () => {
    if (query !== "") {
      try {
        const result = await Axios.get(url);
        if (!result.data.more) {
          setAlert("No dish with this name.");
          return;
        }
        setRecipes(result.data.hits);
        console.log(url)
        setAlert("");
        setQuery("");
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlert("Error retrieving data. Please try again.");
      }finally{
        setLoading(true)
      }
    }else {
      setAlert("Please fill the form");
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
  
  
  return (
    <div className="App">
      <h1 onClick={getData}>Search Your Meal</h1>
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
      <button onClick={handleFilter} className="button">Filters +</button>
        {filterOn !== false && 
        <div className="filter-buttons">
           <select
          className="selection"
          value={selectedNumber}
          onChange={handleSelection}
        >
          <option value="" selected hidden>Select the number of recipes</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <select
          className="selection"
          value={cuisineType}
          onChange={handleCuisine}
          
        >
          <option value="" selected hidden>Select the Cuisine</option>
          <option value="American">American</option>
          <option value="Asian">Asian</option>
          <option value="British">British</option>
          <option value="Carribean">Carribean</option>
          <option value="Central Europ">Central Europe</option>
          <option value="Chinese">Chinese</option>
          <option value="Eastern Europe">Eastern Europe</option>
          <option value="French">French</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Kosher">Kosher</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Mexican">Mexican</option>
          <option value="Middle Easter">Middle Eastern</option>
          <option value="Nordic">Nordic</option>
          <option value="South American">South American</option>
          <option value="South East Asia">South East Asian</option>
        </select>

        <select
          className="selection"
          value={mealType}
          onChange={handleMealType}
        >
          <option value="" selected hidden>Select meal type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Dinner">Dinner</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Teatime">Teatime</option>
        </select>

        </div>
        }


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
