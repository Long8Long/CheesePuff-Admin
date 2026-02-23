**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `sign-in.tsx`
  - Core function: Sign-in page route, renders authentication sign-in form;
  - Technical details: Public route (no auth required), redirects to dashboard after successful login;
  - Key parameters: redirect URL query param (post-login destination)
- `sign-in-2.tsx`
  - Core function: Alternative sign-in page route with different layout/design;
  - Technical details: Second variant of sign-in page for A/B testing or design options;
  - Key parameters: redirect URL query param
- `sign-up.tsx`
  - Core function: Sign-up (registration) page route, renders new user registration form;
  - Technical details: Public route, creates new account, redirects to dashboard or email verification;
  - Key parameters: redirect URL query param
- `forgot-password.tsx`
  - Core function: Forgot password page route, renders password reset request form;
  - Technical details: Public route, sends reset email to user;
  - Key parameters: email input
- `otp.tsx`
  - Core function: OTP verification page route, renders one-time password input form;
  - Technical details: Public route, verifies email/phone OTP code;
  - Key parameters: OTP code (6 digits)
