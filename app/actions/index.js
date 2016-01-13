import fetch from 'isomorphic-fetch'

import {API} from '../config.json'

export function signIn() {
  fetch(`${API}/8/signup`, {method: 'put'})
    .then(res => {
      console.log(res)
      return res.json()
    })
    .then(json => {
      console.log(json)
    }).catch(e => {
      console.log(e)
    })
}

