import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { getEnv } from '../utils/env';
import { createApiClient } from '../services/apiClient';
import { createMockApi } from '../services/mockApi';

const AppContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  animal: null,
  datePreset: 'today',
  dateRange: null, // {start,end}
  filters: {
    behaviors: [],
    duration: [0, 3600],
    timeOfDay: [0, 24],
    camera: 'any',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN': return { ...state, user: action.user, token: action.token };
    case 'SIGN_OUT': return { ...state, user: null, token: null };
    case 'SET_ANIMAL': return { ...state, animal: action.animal };
    case 'SET_DATE_PRESET': return { ...state, datePreset: action.preset };
    case 'SET_DATE_RANGE': return { ...state, dateRange: action.range };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.filters } };
    default: return state;
  }
}

// PUBLIC_INTERFACE
export function AppProviders({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const env = getEnv();
  const api = useMemo(() => {
    if (env.useMock || !env.apiBase) return createMockApi();
    return createApiClient(env.apiBase);
  }, [env.apiBase, env.useMock]);

  const signIn = async (email, token) => dispatch({ type: 'SIGN_IN', user: { email }, token });
  const signOut = () => dispatch({ type: 'SIGN_OUT' });
  const setAnimal = (animal) => dispatch({ type: 'SET_ANIMAL', animal });
  const setDatePreset = (preset) => dispatch({ type: 'SET_DATE_PRESET', preset });
  const setDateRange = (range) => dispatch({ type: 'SET_DATE_RANGE', range });
  const setFilters = (filters) => dispatch({ type: 'SET_FILTERS', filters });

  const value = { state, api, signIn, signOut, setAnimal, setDatePreset, setDateRange, setFilters };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProviders');
  return ctx;
}
