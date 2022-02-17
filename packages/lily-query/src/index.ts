export * from './url';
import axios, { AxiosError, AxiosResponse } from "axios";
import { Ok, Err } from "ts-results";
import { UPDATE_OR_DELETE } from './url';

const log = true;
const authCreds = {
  withCredentials: true,
}
const notAuthCreds = {}

export const updateOrDelete = async (
    data: {
        deleteData: any,
        updateData: any,
    }, 
    bookId: string
) => {
  
    if (log) {
      console.log(data);
      return;
    }
  
    await axios.post(UPDATE_OR_DELETE, {
      bookId,
      json: JSON.stringify(data),
    }, {
      withCredentials: true,
    })
    .then((res: any) => {
      return res;
    });
}

export const createNodeQuery = async (props: {
    url: string,
    uploadData: any,
}) => {
    const { url, uploadData } = props;
    return await axios
        .post(
            url,
            uploadData,
            {
                withCredentials: true,
            }
        )
        .then((res) => Ok(res.data))
        .catch((err) => Err(err));
}

type PostQueryData = {
  url: string,
  data: any,
}

type GetQueryData = {
  url: string,
}

export const postQuery = (postQueryData: PostQueryData) => {
  const { url, data} = postQueryData;
  return new Promise((resolve, reject) => {
    axios.post(url,data,authCreds)
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