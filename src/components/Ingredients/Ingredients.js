import React, {  useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';


// the value of new state depends on the old state
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [
        ...currentIngredients,
        action.ingredient
      ];
    case 'DELETE':
      return currentIngredients.filter(ingredient => ingredient.id !== action.id)
    default:
      throw new Error('Beware of harlots!');
  }
}

// connected states
const httpStateReducer = (currentState, action) => {
  switch (action.type) {
    case 'SEND':
      return {...currentState, loading: true};
    case 'SUCCESS':
      return {...currentState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...currentState, error: null}
    default:
      throw new Error('Beware of http harlots!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []); // reducer fn and initial state
  const [httpState, httpDispatch] = useReducer(httpStateReducer, {loading: false, error: null})
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);

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
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const removeIngredientsHandler = ingredientId => {
    // setIsLoading(true);
    httpDispatch({type: 'SEND'});
    fetch(`https://hooks-cardio-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {method: 'DELETE'})
    .then(
      response => {
        // setIsLoading(false)
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
        dispatch({type: 'DELETE', id: ingredientId});
        httpDispatch({type: "SUCCESS"})
      }
    ).catch(error => {
      // setIsLoading(false);
      // setError('Something went wrong!')
      httpDispatch({type: 'ERROR', errorMessage: "Mayday!"})
    })
  }

  const addIngredientHandler = ingredient => {
    httpDispatch({type: 'SEND'});
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
        httpDispatch({type: "SUCCESS"})
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
      }).catch(error => {
      // setIsLoading(false);
      // setError('Something went wrong!')
      httpDispatch({type: 'ERROR', errorMessage: "Mayday!"})
    });
  };
  const clearError = () => {
    httpDispatch({type: 'CLEAR'})
  }
  return (
    <div className="App">
      {httpState.error ? <ErrorModal onCLose={clearError}>{httpState.error}</ErrorModal> : null}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

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
