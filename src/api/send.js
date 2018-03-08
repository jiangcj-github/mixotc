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
