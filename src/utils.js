export const API = 'http://localhost:2999/api'//api.pithy.af/api'

export const simplify = str => str.toLowerCase().replace(/[^\w ]/g, '').replace(/ /g, '-')
