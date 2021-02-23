import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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
  }, []);

  const removeIngredientsHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://hooks-cardio-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {method: 'DELETE'})
    .then(
      response => {
        setIsLoading(false)
        setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
      }
    ).catch(error => {
      setIsLoading(false);
      setError('Something went wrong!')
    })
  }

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
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
        setIsLoading(false);
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };
  const clearError = () => {
    setError(null);
  }
  return (
    <div className="App">
      {error ? <ErrorModal onCLose={clearError}>{error}</ErrorModal> : null}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onFilteredIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientsHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
