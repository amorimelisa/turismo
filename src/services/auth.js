import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const defaultApiUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
const apiUrl = configuredApiUrl || defaultApiUrl;

async function fetchWithRetry(url, options, attempts = 3) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, (4 - attempts) * 350));
    return fetchWithRetry(url, options, attempts - 1);
  }
}

async function request(path, { method = 'GET', data, token } = {}) {
  let response;
  const headers = {};
  if (data !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    response = await fetchWithRetry(`${apiUrl}${path}`, {
      method,
      headers,
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o servidor está iniciado e se o endereço da API está correto.'
    );
  }

  if (response.status === 204) return null;

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('A API retornou uma resposta inválida.');
  }

  if (!result || typeof result !== 'object') {
    throw new Error('A API retornou uma resposta inválida.');
  }

  if (!response.ok) {
    throw new Error(
      typeof result.error === 'string'
        ? result.error
        : 'Não foi possível concluir a solicitação.'
    );
  }

  return result;
}

export async function login(email, password) {
  return loginWithPath('/auth/login', email, password);
}

export async function loginAdmin(email, password) {
  return loginWithPath('/auth/admin/login', email, password);
}

async function loginWithPath(path, email, password) {
  const result = await request(path, {
    method: 'POST',
    data: { email, password },
  });
  if (!result.token || !result.user) {
    throw new Error('A API não retornou os dados da sessão.');
  }
  return { ...result.user, accessToken: result.token };
}

export async function register(user) {
  return request('/auth/register', { method: 'POST', data: user });
}

export async function logout(token) {
  return request('/auth/logout', { method: 'POST', token });
}

export async function listStories() {
  const result = await request('/stories');
  return result.stories;
}

export async function publishStory(story, token) {
  const result = await request('/stories', {
    method: 'POST',
    data: story,
    token,
  });
  return result.story;
}

export async function listAdminUsers(token) {
  const result = await request('/admin/users', { token });
  return result.users;
}

export async function setAdminUserActive(userId, active, token) {
  return request(`/admin/users/${userId}/active`, {
    method: 'PATCH',
    data: { active },
    token,
  });
}

export async function listAdminStories(token) {
  const result = await request('/admin/stories', { token });
  return result.stories;
}

export async function deleteAdminStory(storyId, token) {
  return request(`/admin/stories/${storyId}`, {
    method: 'DELETE',
    token,
  });
}
