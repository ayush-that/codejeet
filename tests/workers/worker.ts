import { AccountData } from "../../lib/sync/account-do";

export { AccountData };

const worker = {
  fetch(): Response {
    return new Response("sync test worker");
  },
};

export default worker;
