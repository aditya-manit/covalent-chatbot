import axios from "axios";
import * as qs from "qs";



export const get = async (url: string, data?: any, headers?: any) => {
  try {
    console.log(`debug get data with url ${url} : data ${JSON.stringify(data)}, : headers ${JSON.stringify(headers)}`)
    const options = {
      headers,
      params: data
    };
    const result = await axios.get(url, options)
    return result.data
  } catch (error) {
    return null
  }
}

export const post = async (url: string, data?: any, config?: any) => {
  try {
    //console.log(`debug post data with url ${url} : data ${JSON.stringify(data)}, : config ${JSON.stringify(config)}`)
    const result = await axios.post(url, data, config);
    return result.data
  } catch (error) {
    return null
  }
}


