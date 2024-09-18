export const oktaConfig = {
  clientId: "0oajr1ziow2Sq5Mvh5d7",
  issuer: "https://dev-44238025.okta.com/oauth2/default",
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true
}
