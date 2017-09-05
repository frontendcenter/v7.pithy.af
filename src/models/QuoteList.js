import { extendObservable, observable } from 'mobx'

import { API, fetch_json } from '../utils'
import Quote from './Quote'

const CachedMap = (key_fn = String) => {
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

const quote_lists = CachedMap()

const QuoteList = {
  for_endpoint: quote_lists.get_or_fetch(
    endpoint =>
      fetch_json(`${API}/${endpoint}`)
        .then(data => data.map(Quote.add))
  )
}

export default QuoteList
