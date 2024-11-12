import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_6rob18eEz',
      userPoolClientId: '1s2u15tlv7uh3hv226a48ecjp5',
      signUpVerificationMethod: 'code'
    }
  }
});

// Helper function to check auth status
export async function checkAuthStatus() {
  try {
    const session = await getCurrentUser();
    return {
      isAuthenticated: true,
      user: session
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null
    };
  }
}