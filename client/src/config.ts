// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it


const apiId = 't4o5uaq5yd'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
// TODO: Create an Auth0 application and copy values from it into this map

  
  domain: 'dev-xa9u920z.auth0.com',    // Auth0 domain  
  clientId: '46g7LYL8gq42DQEBADiAEuL6yR895x9R',      // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
