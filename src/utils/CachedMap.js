import { ObservableMap } from 'mobx'

const MISSING_FETCHER = "CachedMap.get_or_fetch requires a fetch_and_transform argument if no default_fetcher is set!"
export const CachedMap = ({
  key_fn = String, // Effectively the same as x => x.toString()
  default_fetcher
} = {}) => {
  const _map = new ObservableMap()

  return {
    _map,
    get_or_fetch: (raw_key, { fetcher = default_fetcher } = {}) => {
      if (!fetcher) throw new Error(MISSING_FETCHER)

      const key = key_fn(raw_key)
      if (!_map.has(key)) {
        _map.set(key, null)
        fetcher(key)
          .then(data => _map.set(key, data))
      }
      return _map.get(key)
    },

    create_or_update: (raw_key, { create, update }) => {
      const key = key_fn(raw_key)
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
