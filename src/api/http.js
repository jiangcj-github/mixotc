import axios from 'axios';
export function upload(url, op, obj, callback) {
  let a = new FormData(),
      config = { 
        headers: { 
          "Content-Type": "multipart/form-data" 
        } 
      };
  a.append(op, obj);
  axios.post(url, a, config).then(res => {
    if (res.status === 200) {
      callback(res.data);
    }
  });
}
