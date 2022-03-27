import axios, { AxiosError, AxiosResponse } from "axios";
import { DELETE_NODE, DELETE_AND_UPDATE_NODE } from './url';
export * from './url';

const log = false;
const authCreds = {
  withCredentials: true,
}

export const updateOrDelete = async (
    data: {
        deleteData: any,
        updateData: any,
    }, 
    bookId: string
) => {
    let __URL = data.updateData === null ? DELETE_NODE : DELETE_AND_UPDATE_NODE; 
    if (log) {
      console.log(data);
      console.log(__URL);
      return;
    }
    await axios.post(__URL, {
      bookId,
      ...data,
    }, {
      withCredentials: true,
    })
    .then((res: any) => {
      return res;
    });
}


type PostQueryData = {
  url: string,
  data: any,
}

type GetQueryData = {
  url: string,
}

export const postQuery = (postQueryData: PostQueryData) => {
  const { url, data } = postQueryData;
  return new Promise((resolve, reject) => {
    axios.post(url,data,authCreds)
    .then((res: AxiosResponse<any>) => {
        console.log('res', res)
        resolve(res);
    })
    .catch((err: AxiosError<any>) => {
      reject(err);
    })
  });
}

export const postNoDataQuery = (postNoQueryData: any) => {
  const { url } = postNoQueryData;
  return new Promise((resolve, reject) => {
    axios.post(url,{}, authCreds)
    .then((res: AxiosResponse<any>) => {
        resolve(res);
    })
    .catch((err: AxiosError<any>) => {
      reject(err);
    })
  });
}

export const getQueryAuth = async (getQueryData: GetQueryData) => {
  const { url } = getQueryData;
  return new Promise((resolve, reject) => {
    axios.get(url,authCreds)
    .then((res: AxiosResponse<any>) => {
        resolve(res)
    })
    .catch((err: AxiosError<any>) => {
        reject(err)
    })
  });
}

export const callAxios = async (props: any) => {
  const { url, callBack } = props;
  axios.get(url, authCreds)
  .then((res: AxiosResponse<any>) => {
      callBack({ isTrue: true, ...res })
  })
  .catch((err: AxiosError<any>) => {
    callBack({ isTrue: false, ...err })
  })
}