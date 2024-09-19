export const oktaConfig = {
  clientId: "0oajrtourvx6WZWDF5d7",
  issuer: "https://dev-06465044.okta.com/oauth2/default",
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true
}
