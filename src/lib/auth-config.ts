import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID!,
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