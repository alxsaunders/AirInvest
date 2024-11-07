import { Amplify } from 'aws-amplify';

// Initialize Amplify with hardcoded values
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_6rob18eEz',
      userPoolClientId: '1s2u15tlv7uh3hv226a48ecjp5'
    }
  }
});

// Helper to check configuration
export const isConfigured = () => {
  const config = Amplify.getConfig();
  return !!(
    config.Auth?.Cognito?.userPoolId &&
    config.Auth?.Cognito?.userPoolClientId
  );
};