import { authenticate } from "ldap-authentication";
import { read } from "read";

const LDAP_SERVER = prompt(
  "Please enter the url or IP address of the LDAP server: "
).trim();
const LDAP_PROTO = prompt("Please enter the protocol (ldap or ldaps): ").trim();
const LDAP_PORT = LDAP_PROTO === "ldaps" ? 636 : 389;
const LDAP_DOMAIN = prompt("Please enter the domain name: ").trim();

async function testUserCred() {
  console.info('Enter username/password or "q" to quit\r\n');
  const username = await read({ prompt: "Username: " });
  if (username.toLowerCase() === "q") {
    process.exit();
  }
  const password = await read({ silent: true, prompt: "Password: " });
  console.log("\r\n");
  const config = {
    ldapOpts: {
      url: `${LDAP_PROTO}://${LDAP_SERVER}:${LDAP_PORT}`,
    },
    userDn: `${LDAP_DOMAIN}\\${username}`,
    userPassword: password,
  };

  if (LDAP_PROTO.toLowerCase() === "ldaps") {
    config.ldapOpts.tlsOptions = { rejectUnauthorized: false };
  }
  try {
    console.table({ url: config.ldapOpts.url, userDn: config.userDn });
    const user = await authenticate(config);
    console.log("Success:", JSON.stringify(user, null, 2));
    console.log("\r\n");
  } catch (e) {
    console.error("Error:", e.message);
    console.log("\r\n");
  } finally {
    testUserCred();
  }
}
testUserCred();
