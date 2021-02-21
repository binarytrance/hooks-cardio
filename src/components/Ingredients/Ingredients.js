import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // useEffect(() => {
  //   fetch('https://hooks-cardio-default-rtdb.firebaseio.com/ingredients.json')
  //     .then(response => {
  //       // console.log(response.json());
  //       return response.json();
  //     })
  //     .then(responseData => {
  //       console.log(responseData);

  //       const loadedIngredients = []
  //       for(const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         })
  //       }
  //       setUserIngredients(loadedIngredients)
  //     });
  // }, []);

  useEffect(() => {
    console.log('rerendering', userIngredients)
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => { // useCallback caches this function and therefor survives rerender cycles
    setUserIngredients(filteredIngredients);
  }, [])

  const addIngredientHandler = ingredient => {
    fetch('https://hooks-cardio-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        // console.log(response.json());
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onFilteredIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
