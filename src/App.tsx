import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import Autocomplete from './components/Autocomplete/Autocomplete'
import { useEventCallback } from 'rxjs-hooks'
import { of, from } from 'rxjs'
import { debounceTime, map, switchMap, catchError, tap, filter } from 'rxjs/operators'
import './App.css';
import useDebounce from './hooks/useDebounce';
import jsonp from 'jsonp'

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [syncOptions, setSyncOptions] = useState(['1', '2', '3'])
  const [searchResults, setSearchResults] = useState(['1', '2', '3'])
  const [loading, setLoading] = useState(false)
  const [warning, toggleWarning] = useState(false)

  const geOptions = (v: string) => [repeat(v), repeat(v, 2), repeat(v, 3)]

  const searchQuery = (value: string) => {
    const headers = new Headers({
      'Access-Control-Allow-Origin':'*',
      "Content-Type":'application/json'
    })
    const fetchingUrl = `//suggest.taobao.com/sug?code=utf-8&q=${value}`
    return from(fetch(fetchingUrl, { mode: 'cors', headers }))
  }


  /* const [searchCallback, [status, result]] = useEventCallback<string, [string, any]>(val$ => 
    val$.pipe(
      debounceTime(500),
      tap(() => {
        toggleWarning(false)
        setLoading(true)
      }),
      map(str => str.trim()),
      // Use a little bit hack on here
      filter(str => {
        const strExists = !!str
        const lengthCondition = str.length < 30
        if (!lengthCondition) {
          toggleWarning(true)
          setLoading(false)
        }
        return strExists && lengthCondition
      }),
      switchMap(str => {
        setLoading(true)

        if (str.length > 30) {
          toggleWarning(true)
          setLoading(false)
          return of(['error', []] as [string, any])
        }
        
        return searchQuery(str).pipe(
          map((response) => {
            // On succeed
            console.log(response);
            return ['success', setSearchResults((response as any).result.map((item: [string, string]) => item[0]))]
          }),
          catchError(error => { 
            // Do something when request failure 
            return ['error', []] as [string, any]
          }),
  
        )
      }),
      tap(() => {
        setLoading(false)
      })
    ),
    ['', null]
  ) */

  const [asyncSearchValue, setAsyncSearchValue] = useState('')
  const debouncedSearchTerm = useDebounce(asyncSearchValue)

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        jsonp(`//suggest.taobao.com/sug?code=utf-8&q=${asyncSearchValue}`, (err, response) => {
          setSearchResults(response.result.map((item: [string, string]) => item[0]))
        })
      }
    },
    [debouncedSearchTerm]
  )

  return (
    <div className="App">
      <h1>BAutocomplete </h1>
      
      <h2>With two way binding</h2>
      <Autocomplete 
        options={syncOptions}
        onSearch={v => setSyncOptions(geOptions(v))}
        value={searchValue}
        onSelect={v => {
          setSearchValue(v)
        }}
        onChange={v => setSearchValue(v)}
      />

      <h2>Async fetching</h2>
      <p>
        {loading && 'loading...'}
        {warning && 'warning text'}
      </p>
      <Autocomplete 
        options={searchResults}
        onSearch={v => setAsyncSearchValue(v)}
      />
    </div>
  );
}
const repeat = (s: string, n = 1) => s.repeat(n)

export default App;
