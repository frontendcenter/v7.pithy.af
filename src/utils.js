export const API = 'http://api.pithy.af/api'

export const simplify = str => str.toLowerCase().replace(/[^\w ]/g, '').replace(/ /g, '-')

export const fetch_json = (url, opts = {}) => fetch(url, opts).then(response => response.json())

export const identity_fn = x => x
