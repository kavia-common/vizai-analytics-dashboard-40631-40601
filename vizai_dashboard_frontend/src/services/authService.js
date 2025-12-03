// PUBLIC_INTERFACE
export async function signIn(email, password) {
  await new Promise((r) => setTimeout(r, 300));
  if (password === 'fail') {
    const err = new Error('Invalid credentials');
    err.code = 'AUTH_FAILED';
    throw err;
  }
  return { token: 'demo-token', user: { email } };
}
