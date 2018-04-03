import jsonBig from "json-bigint";

const sendSmsHeader = {
    ver: 1,
    op: 4
  },
  loginHeader = {
    ver: 1,
    op: 17
  },
  sendCodeHeader = {
    ver: 1,
    op: 15
  },
  controlHeader = {
    ver: 1,
    op: 21
  };
export function sendToken(json) {
  return jsonBig.stringify(Object.assign({}, loginHeader, json));
}