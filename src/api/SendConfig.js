import jsonBig from "json-bigint";

const headConfig = {
  send_code: {
    ver: 1,
    op: 15
  },
  login: {
    ver: 1,
    op: 17
  },
  logout: {
    ver: 1,
    op: 19
  },
  send_sms: {
    ver: 1,
    op: 4
  },
  topic: {
    ver: 1,
    op: 27
  },
  deliver_sms: {
    ver: 1,
    op: 5
  },
  anonymous_sms: {
    ver: 1,
    op: 7
  },
  notify: {
    ver: 1,
    op: 24
  },
  control: {
    ver: 1,
    op: 21
  },
  wallet: {
    ver: 1,
    op: 29
  },
  otc: {
    ver: 1,
    op: 31
  }
};
export default function(head, obj) {
  return jsonBig.stringify(Object.assign({}, headConfig[head], obj));
}
