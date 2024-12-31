import axios from "axios";
import { parseCookies } from "nookies";

export function getApiClient(ctx?: any) {
  const { '@juscash.token': token} = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if(token) {
    api.defaults.headers['x-access-token'] = token
  }

  return api
}

export const api = getApiClient()