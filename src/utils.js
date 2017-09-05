import { ObservableMap } from 'mobx'

export const API = 'http://api.pithy.af/api'

export const simplify = str => str.toLowerCase().replace(/[^\w ]/g, '').replace(/ /g, '-')

export const fetch_json = (url, opts = {}) => fetch(url, opts).then(response => response.json())

export const identity_fn = x => x

export const CachedMap = ({
  url_fn = String,
  before_save = identity_fn,
  key_fn = url_fn
}) => {
  const _map = new ObservableMap()

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
