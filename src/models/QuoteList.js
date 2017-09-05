import { extendObservable, observable } from 'mobx'

import { API, fetch_json, identity_fn } from '../utils'
import Quote from './Quote'

const CachedMap = ({
  url_fn = String,
  before_save = identity_fn,
  key_fn = url_fn
}) => {
  const _map = observable.map()

  return {
    _map,
    get_or_fetch: (...args) => {
      const key = key_fn(...args)
      if (!_map.has(key)) {
        _map.set(key, null)
        fetch_json(url_fn(...args))
          .then(before_save)
          .then(data => _map.set(key, data))
      }
      return _map.get(key)
    }
  }
}

const quote_lists = CachedMap({
  url_fn: endpoint => `${API}/${endpoint}`,
  before_save: data => data.map(Quote.add)
})

const QuoteList = {
  for_endpoint: endpoint => quote_lists.get_or_fetch(endpoint)
}

export default QuoteList
