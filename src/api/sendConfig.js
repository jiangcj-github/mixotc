import jsonBig from "json-bigint";

export function sendSms(type, seq, tid, obj) {
  return jsonBig.stringify({
    ver: 1,
    op: 4,
    seq: seq,
    body: {
      action: "send_sms",
      type: type,
      gid: 0,
      tid: tid,
      data: obj
    }
  });
}

export function sendCode(type, seq, account) {
  console.log(jsonBig.stringify({
    ver: 1,
    op: 15,
    seq: seq,
    body: {
      phone: type === 'phone' ? account : '',
      email: type === 'email' ? account : ''
    }
  })
)
  return jsonBig.stringify({
    ver: 1,
    op: 15,
    seq: seq,
    body: {
      phone: type === 'phone' ? account : '',
      email: type === 'email' ? account : ''
    }
  });
}

export function sendLogin(type, seq, account, code) {
  return jsonBig.stringify({
    ver: 1,
    op: 17,
    seq: seq,
    body: {
      phone: type === 'phone' ? account : '',
      email: type === 'email' ? account : '',
      code: code
    }
  });
}