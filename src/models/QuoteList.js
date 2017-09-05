import { extendObservable, observable } from 'mobx'

import { API, fetch_json } from '../utils'
import Quote from './Quote'

const LazyMap = (key_fn = String) => {
  const _map = observable.map()

  return {
    _map,
    get_or_fetch: fetcher => (...args) => {
      const key = key_fn(...args)
      if (!_map.has(key)) {
        _map.set(key, null)
        fetcher(...args).then(data => _map.set(key, data))
      }
      return _map.get(key)
    }
  }
}

const lists_by_endpoint = observable.map()
const lazy_lists = LazyMap()

const QuoteList = {
  _for_endpoint: endpoint => {
    if (!lists_by_endpoint.has(endpoint)) {
      lists_by_endpoint.set(endpoint, null)
      fetch_json(`${API}/${endpoint}`)
        .then(data => lists_by_endpoint.set(endpoint, data.map(Quote.add)))
    }
    return lists_by_endpoint.get(endpoint)
  },
  for_endpoint: lazy_lists.get_or_fetch(endpoint => {
    console.log(endpoint)
    return fetch_json(`${API}/${endpoint}`)
      .then(data => data.map(Quote.add))
  })
}

export default QuoteList
