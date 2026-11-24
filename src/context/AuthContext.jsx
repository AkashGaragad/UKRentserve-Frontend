import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi, healthApi } from '../api';

const AuthContext = createContext(null);

export const DEMO_PRESETS = [
  { role: 'customer', label: 'Demo Customer', email: 'demo.customer@nukrentserve.com', password: 'Demo@Customer123', name: 'Demo Customer', location: 'Dehradun' },
  { role: 'owner',    label: 'Demo Property Owner', email: 'demo.owner@nukrentserve.com', password: 'Demo@Owner123', name: 'Ramesh Sharma', location: 'Dehradun' },
  { role: 'provider', label: 'Demo Service Provider', email: 'demo.provider@nukrentserve.com', password: 'Demo@Provider123', name: 'Sunil Verma', location: 'Dehradun' },
  { role: 'driver',   label: 'Demo Driver', email: 'demo.driver@nukrentserve.com', password: 'Demo@Driver123', name: 'Rajesh Negi', location: 'Dehradun' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Check backend health periodically
  const checkHealth = useCallback(async () => {
    try {
      await healthApi.check();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Sync profile if token is present
  useEffect(() => {
    if (token) {
      userApi.getMe()
        .then(({ data }) => {
          const u = data?.data || data?.user || data;
          if (u && (u._id || u.id || u.email)) {
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));
          }
        })
        .catch(() => {
          // Token expired or server unreachable, preserve local state if demo
        });
    }
  }, [token]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({
        email: identifier,
        identifier,
        password,
      });

      const payload = data?.data || data;
      const accessToken = payload.accessToken || payload.token;
      const u = payload.user || payload;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
      }
      if (u) {
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
      }
      return { success: true, user: u };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      // If backend is offline or returned 502/network error, allow demo fallback
      if (!err.response || err.response.status >= 500) {
        const foundDemo = DEMO_PRESETS.find(p => p.email === identifier.toLowerCase());
        if (foundDemo && password === foundDemo.password) {
          return quickDemoLogin(foundDemo.role);
        }
      }
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authApi.register({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        location: payload.location || 'Dehradun',
        role: payload.role || 'customer',
      });

      const resData = data?.data || data;
      const accessToken = resData.accessToken || resData.token;
      const u = resData.user || resData;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
      }
      if (u) {
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
      }
      return { success: true, user: u };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      // Offline fallback: create valid local session
      if (!err.response || err.response.status >= 500) {
        const localUser = {
          id: 'user_' + Date.now(),
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role || 'customer',
          location: payload.location || 'Dehradun',
          approvalStatus: 'approved',
        };
        const mockToken = 'mock_jwt_' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(localUser));
        setToken(mockToken);
        setUser(localUser);
        return { success: true, user: localUser, note: 'Saved in offline demo mode' };
      }
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role = 'customer') => {
    const preset = DEMO_PRESETS.find(p => p.role === role) || DEMO_PRESETS[0];
    const demoUser = {
      id: 'demo_' + preset.role + '_1',
      _id: 'demo_' + preset.role + '_1',
      name: preset.name,
      email: preset.email,
      phone: '9876543210',
      role: preset.role,
      location: preset.location,
      approvalStatus: 'approved',
      isDemo: true,
    };
    const mockToken = 'mock_demo_token_' + preset.role;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setToken(mockToken);
    setUser(demoUser);
    return { success: true, user: demoUser };
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await userApi.updateMe(updates);
      const updated = data?.data || data?.user || { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { success: true, user: updated };
    } catch {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { success: true, user: updated };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        backendOnline,
        login,
        register,
        logout,
        quickDemoLogin,
        updateProfile,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
