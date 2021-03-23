import { useCallback, useReducer } from "react";

// connected states
const httpStateReducer = (currentState, action) => {
    switch (action.type) {
      case 'SEND':
        return {...currentState, loading: true, data: null};
      case 'SUCCESS':
        return {...currentState, loading: false, data: action.responseData};
      case 'ERROR':
        return {loading: false, error: action.errorMessage};
      case 'CLEAR':
        return {...currentState, error: null}
      default:
        throw new Error('Beware of http harlots!');
    }
  }

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpStateReducer, {loading: false, error: null, data: null})
    const makeRequest = useCallback((url, method, body) => {
        httpDispatch({type: 'SEND'});
        fetch(url, {method: method, body: body, headers: {'Content-Type': 'application/json'}})
        .then(
        response => {
            return response.json()
        }
        ).then(
            responseData => {
                httpDispatch({type: 'SUCCESS', responseData: responseData})
            }
        ).catch(error => {
        // setIsLoading(false);
        // setError('Something went wrong!')
        httpDispatch({type: 'ERROR', errorMessage: "Mayday!"})
        })
    }, [])
    return [httpState, makeRequest]
}

export default useHttp;