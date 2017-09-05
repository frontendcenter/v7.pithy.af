import { ObservableMap } from 'mobx'

export const API = 'http://api.pithy.af/api'

export const simplify = str => str.toLowerCase().replace(/[^\w ]/g, '').replace(/ /g, '-')

export const fetch_json = (url, opts = {}) => fetch(url, opts).then(response => response.json())

export const _throw = message => {
  throw new Error(message)
}

export const CachedMap = ({
  key_fn = String, // Same as calling toString on the first arg but handles null/undefined
  fetch_callback = _throw("Fetch callback is required to use a CachedMap")
}) => {
  const _map = new ObservableMap()

  return {
    _map,
    get_or_fetch: (...args) => {
      const key = key_fn(...args)
      if (!_map.has(key)) {
        _map.set(key, null)
        fetch_callback(...args)
          .then(data => _map.set(key, data))
      }
      return _map.get(key)
    },

    create_or_update: (key, { create, update }) => {
      const existing = _map.get(key)
      if (existing) {
        update(existing)
        return existing
      } else {
        const created = create()
        _map.set(key, created)
        return created
      }
    }
  }
}
