// let TransmuteFramework = require("transmute-framework").default;
// const path = require("path");

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// const FRAMEWORK_ENV_PATH = path.join(
//   process.cwd(),
//   "../secrets/environment.secret.env"
// );

// let config;
// const detectedCloud = () => {
//   try {
//     config = functions.config();
//     return true;
//   } catch (e) {
//     return false;
//   }
// };
// FRAMEWORK_ENV = detectedCloud() ? "NODE_CLOUD" : "NODE_LOCAL";
// if (FRAMEWORK_ENV === "NODE_LOCAL") {
//   require("dotenv").config({ path: FRAMEWORK_ENV_PATH });
// } else {
//   // config will have the correct values...
// }

// const GOOGLE_PROJECT_SERVICE_ACCOUNT_ABS_PATH = (FRAMEWORK_ENV === "NODE_LOCAL") ? process.env.GOOGLE_PROJECT_SERVICE_ACCOUNT_ABS_PATH : config.dapp.google_project_service_account_abs_path;
// const GOOGLE_PROJECT_FIREBASE_CONFIG_ABS_PATH = (FRAMEWORK_ENV === "NODE_LOCAL") ? process.env.GOOGLE_PROJECT_FIREBASE_CONFIG_ABS_PATH : config.dapp.google_project_firebase_config_abs_path;
// const GOOGLE_PROJECT_NAME = (FRAMEWORK_ENV === "NODE_LOCAL") ? process.env.GOOGLE_PROJECT_NAME : config.dapp.google_project_name;
// const TRANSMUTE_API_BASE_URL = (FRAMEWORK_ENV === "NODE_LOCAL") ? process.env.TRANSMUTE_API_BASE_URL : config.dapp.transmute_api_base_url;

// if (FRAMEWORK_ENV === "NODE_LOCAL") {
//   admin.initializeApp({
//     credential: admin.credential.cert(
//       require(GOOGLE_PROJECT_SERVICE_ACCOUNT_ABS_PATH)
//     )
//   });
// }

// if (FRAMEWORK_ENV === "NODE_CLOUD") {
//   admin.initializeApp(functions.config().firebase);
// }

// let transmuteConfig = {
//   providerUrl: "http://localhost:8545",
//   aca: require("./build/contracts/RBAC.json"),
//   esa: require("./build/contracts/RBACEventStore.json"),
//   esfa: require("./build/contracts/RBACEventStoreFactory.json"),
//   firebaseAdmin: admin
// };

// TransmuteFramework.init(transmuteConfig);

// module.exports = {
//   TransmuteFramework,
//   GOOGLE_PROJECT_SERVICE_ACCOUNT_ABS_PATH,
//   GOOGLE_PROJECT_FIREBASE_CONFIG_ABS_PATH,
//   GOOGLE_PROJECT_NAME,
//   TRANSMUTE_API_BASE_URL,
// };
