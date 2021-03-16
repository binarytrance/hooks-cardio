import React, {useEffect, useState, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({onFilteredIngredients}) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const searchRef = useRef();
  useEffect(() => {
    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
    const timer = setTimeout(() => {
      if(enteredFilter ===searchRef.current.value) {
        fetch('https://hooks-cardio-default-rtdb.firebaseio.com/ingredients.json' + query)
        .then(response => {
          // console.log(response.json());
          return response.json();
        })
        .then(responseData => {
          console.log(responseData, 'responsedata');

          const loadedIngredients = []
          for(const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            })
          }
          onFilteredIngredients(loadedIngredients);
          console.log(loadedIngredients, 'lala');

        });
      }
    }, 500);
    return () => { // this function will run right before this useEffect fn will run the NEXT time, not after this fn is done - much more memory efficient
      clearTimeout(timer)
    };
  }, [enteredFilter, onFilteredIngredients, searchRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} ref={searchRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
