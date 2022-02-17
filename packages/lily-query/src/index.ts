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
  successCallBack: any,
  errorCallBack: any,
}

type GetQueryData = {
  url: string,
  successCallBack: any,
  errorCallBack: any,
}

export const postQuery = async (postQueryData: PostQueryData) => {
  const { url, data, successCallBack, errorCallBack} = postQueryData;
  await axios.post(url,data,authCreds)
  .then((res: AxiosResponse<any>) => {
      if (res && res.data) {
        successCallBack(res.data);
      }
  })
  .catch((err: AxiosError<any>) => {
      if (err.response && err.response.data && err.response.data.message) {
        errorCallBack({credentials: err.response.data.message});
      }
  });
}

export const getQueryAuth = async (getQueryData: GetQueryData) => {
  const { url, successCallBack, errorCallBack} = getQueryData;
  await axios.get(url,authCreds)
  .then((res: AxiosResponse<any>) => {
      if (res && res.data) {
        successCallBack(res.data);
      }
  })
  .catch((err: AxiosError<any>) => {
      if (err.response && err.response.data && err.response.data.message) {
        errorCallBack({credentials: err.response.data.message});
      }
  });
}