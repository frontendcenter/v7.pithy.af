import { ObservableMap } from 'mobx'

const MISSING_FETCHER = "CachedMap.get_or_fetch requires a fetch_and_transform argument if no default_fetcher is set!"

export default class CachedMap {
  constructor({
    key_fn = String, // Effectively the same as x => x.toString()
    default_fetcher
  } = {}) {
    this._map = new ObservableMap()
    this.key_fn = key_fn
    this.default_fetcher = default_fetcher
  }

  get_or_fetch(raw_key, { fetcher = this.default_fetcher } = {}) {
    if (!fetcher) throw new Error(MISSING_FETCHER)

    const key = this.key_fn(raw_key)
    if (!this._map.has(key)) {
      this._map.set(key, null)
      fetcher(key)
        .then(data => this._map.set(key, data))
    }
    return this._map.get(key)
  }

  create_or_update(raw_key, { create, update }) {
    const key = this.key_fn(raw_key)
    const existing = this._map.get(key)
    if (existing) {
      update(existing)
      return existing
    } else {
      const created = create()
      this._map.set(key, created)
      return created
    }
  }
}
