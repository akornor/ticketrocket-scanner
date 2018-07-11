import PouchDB from "pouchdb-react-native";

const REMOTE_DB_URL = "http://b419c4ec.ngrok.io/tickets";
const localDB = new PouchDB("tickets");
const remoteDB = new PouchDB(REMOTE_DB_URL);

const sync = localDB
  .sync(remoteDB, { live: true, retry: true })
  .on("change", info => {
    console.log("info:", info);
  })
  .on("paused", err => {
    console.log("error:", err);
  })
  .on("active", () => {
    console.log("active");
  })
  .on("complete", info => {
    console.log("info:", info);
  })
  .on("error", err => {
    console.log("error:", err);
  })
  .on("denied", err => {
    console.log("denied:", err);
  });

export default localDB;
