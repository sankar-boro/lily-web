import axios from "axios";
import { Ok, Err } from "ts-results";

const log = true;
const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";

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