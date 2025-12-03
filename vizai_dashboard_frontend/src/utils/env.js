export function getEnv() {
  const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  const wsUrl = process.env.REACT_APP_WS_URL || '';
  const useMockEnv = process.env.REACT_APP_USE_MOCK;
  const useMock = useMockEnv === undefined ? true : (useMockEnv === '1' || useMockEnv === 'true');
  return { apiBase, wsUrl, useMock };
}
