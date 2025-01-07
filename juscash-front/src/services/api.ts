import axios from "axios";
import { parseCookies } from "nookies";

const API_URL = process.env.REACT_APP_API_URL

export function getApiClient(ctx?: any) {
  const { '@juscash.token': token} = parseCookies(ctx)

  const api = axios.create({
    baseURL: `${API_URL}/api`,
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