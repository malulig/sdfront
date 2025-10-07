import { api } from "./axios";
import type { User } from "../interfaces/User";
import { useUserStore } from "../store/useUserStore";
import type { AxiosError } from "axios";

/** Достаём cookie по имени нативненько */
function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Ставим/сбрасываем Authorization заголовок в axios */
function setAuthHeader(token: string | null): void {
  if (token && token.trim()) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** Обновление access-токена через refresh-cookie (+ CSRF) */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const csrf = getCookie("csrf_token");
    const { data } = await api.post<{ access_token: string; expires_in?: number }>(
      "/auth/refresh",
      null,
      {
        withCredentials: true,
        headers: csrf ? { "x-csrf-token": csrf } : {},
      }
    );

    // Обновляем store и axios
    useUserStore.getState().setUser({ access_token: data.access_token });
    setAuthHeader(data.access_token);

    return data.access_token;
  } catch (e) {
    const err = e as AxiosError<any>;
    console.error("Ошибка обновления токена:", err.response?.data ?? err.message);
    return null;
  }
};

/** Инициализация пользователя из активной сессии.
 *  1) Пытаемся получить профиль
 *  2) Если 401 — пробуем refresh один раз, затем повторяем запрос профиля
 */
export const initUserFromSession = async (): Promise<User | null> => {
  const doProfile = async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/profile", { withCredentials: true });
    return data;
  };

  try {
    const user = await doProfile();
    useUserStore.getState().setUser(user);
    // Если у нас уже был токен в store — проставим его и в axios
    const token = useUserStore.getState().access_token ?? null;
    setAuthHeader(token);
    return user;
  } catch (e) {
    const err = e as AxiosError<any>;
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const user = await doProfile();
        useUserStore.getState().setUser(user);
        return user;
      } catch (e2) {
        const err2 = e2 as AxiosError<any>;
        console.error("Ошибка при повторной попытке профиля:", err2.response?.data ?? err2.message);
        return null;
      }
    }
    console.error("Ошибка при инициализации пользователя:", err.response?.data ?? err.message);
    return null;
  }
};

/** Запуск авторизации через Azure AD (редирект) */
export const startAzureLogin = (): void => {
  window.location.href = `${api.defaults.baseURL}/auth/azure/login`;
};

/** Выход из системы (logout) */
export const logout = async (): Promise<boolean> => {
  try {
    const csrf = getCookie("csrf_token");

    await api.post(
      "/auth/logout",
      null,
      {
        withCredentials: true,
        headers: csrf ? { "x-csrf-token": csrf } : {},
      }
    );

    // Очищаем store и axios
    useUserStore.getState().setUser({});
    setAuthHeader(null);

    return true;
  } catch (e) {
    console.error("Ошибка при выходе из системы:", e);
    return false;
  }
};
