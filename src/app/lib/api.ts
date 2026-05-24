const BASE = '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('arko_token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Users
export const users = {
  list: () => request<User[]>('/api/users'),
  staff: () => request<User[]>('/api/users/staff'),
  get: (id: string) => request<User>(`/api/users/${id}`),
  create: (data: {
    username: string;
    email: string;
    full_name: string;
    role: string;
    password: string;
  }) =>
    request<{ id: string; message: string }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{
    username: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    activeStatus: boolean;
  }>) =>
    request<{ message: string }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deactivate: (id: string) =>
    request<{ message: string }>(`/api/users/${id}`, { method: 'DELETE' }),
};

// Museums
export const museums = {
  list: () => request<Museum[]>('/api/museums'),
};

// Items
export const items = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ items: Item[]; total: number; page: number; limit: number }>(`/api/items${qs}`);
  },
  get: (id: string) => request<Item>(`/api/items/${id}`),
  create: (data: Partial<Item> & Record<string, any>) =>
    request<{ id: string; message: string }>('/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Item> & Record<string, any>) =>
    request<{ message: string }>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/items/${id}`, { method: 'DELETE' }),
};

// Collections
export const collections = {
  list: () => request<Collection[]>('/api/collections'),
  get: (id: string) => request<Collection>(`/api/collections/${id}`),
  create: (data: { collectionName: string; description?: string; type?: string; notes?: string }) =>
    request<{ id: string; message: string }>('/api/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ collectionName: string; description: string; type: string; notes: string; status: string }>) =>
    request<{ message: string }>(`/api/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Programs
export const programs = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Program[]>(`/api/programs${qs}`);
  },
  get: (id: number) => request<ProgramDetail>(`/api/programs/${id}`),
  create: (data: Partial<Program> & Record<string, any>) =>
    request<{ id: number; message: string }>('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Program> & Record<string, any>) =>
    request<{ message: string }>(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  assignStaff: (id: number, userId: number) =>
    request<{ message: string }>(`/api/programs/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),
  unassignStaff: (id: number, userId: number) =>
    request<{ message: string }>(`/api/programs/${id}/assign/${userId}`, { method: 'DELETE' }),
  addItem: (id: number, itemId: number) =>
    request<{ message: string }>(`/api/programs/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId }),
    }),
  removeItem: (id: number, itemId: number) =>
    request<{ message: string }>(`/api/programs/${id}/items/${itemId}`, { method: 'DELETE' }),
  addCollection: (id: number, collectionId: number) =>
    request<{ message: string }>(`/api/programs/${id}/collections`, {
      method: 'POST',
      body: JSON.stringify({ collection_id: collectionId }),
    }),
  removeCollection: (id: number, collectionId: number) =>
    request<{ message: string }>(`/api/programs/${id}/collections/${collectionId}`, { method: 'DELETE' }),
};

// Digital Assets
export const assets = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<DigitalAsset[]>(`/api/assets${qs}`);
  },
  upload: (formData: FormData) =>
    request<{ id: string; fileName: string; checksum: string }>('/api/assets/upload', {
      method: 'POST',
      body: formData,
    }),
  verify: (id: string) =>
    request<{ id: string; health_status: string }>(`/api/assets/${id}/verify`),
};

// Activity Logs
export const activityLogs = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<ActivityLogEntry[]>(`/api/activity-logs${qs}`);
  },
};

// Submissions
export const submissions = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Submission[]>(`/api/submissions${qs}`);
  },
  create: (data: { item_id?: string; notes?: string }) =>
    request<{ id: number; message: string }>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  review: (id: number, status: 'Approved' | 'Rejected', notes?: string) =>
    request<{ message: string }>(`/api/submissions/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),
};

// Notifications
export const notifications = {
  list: () => request<Notification[]>('/api/notifications'),
  markRead: (id: number) =>
    request<{ message: string }>(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () =>
    request<{ message: string }>('/api/notifications/read-all', { method: 'PUT' }),
};

// Lookups — values match schema.sql ENUMs exactly
export const lookups = {
  documentTypes: () => request<string[]>('/api/lookups/document-types'),
  artifactTypes: () => request<string[]>('/api/lookups/artifact-types'),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  role: string;
  is_active: number;
}

export interface Museum {
  id: number;
  name: string;
  museum_type: string;
  hours: string;
}

export interface Item {
  id: string;
  item_identifier: string;
  title: string;
  description: string | null;
  type_name: 'artifact' | 'document';
  document_type: string | null;
  artifact_type: string | null;
  collection_id: string | null;
  collection_name: string | null;
  author: string | null;
  authorFirstName: string | null;
  authorLastName: string | null;
  height: number | null;
  width: number | null;
  length: number | null;
  physical_dimensions: string | null;
  texture: string | null;
  color: string | null;
  provenance: string | null;
  remarks: string | null;
  acquisition_date: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  status: string;
  item_count: number;
}

export interface Program {
  id: number;
  name: string;
  description: string | null;
  program_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_by_name: string;
  staff_count: number;
  item_count: number;
}

export interface ProgramDetail extends Program {
  staff: User[];
  items: Item[];
  collections: Collection[];
}

export interface DigitalAsset {
  id: string;
  program_id: string | null;
  item_id: string;
  uploaded_by: string;
  uploaded_by_name: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_format: string | null;
  checksum: string | null;
  health_status: string;
  upload_timestamp: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string | null;
  created_at: string;
}

export interface Submission {
  id: number;
  item_id: string | null;
  submitted_by: string;
  submitted_by_name: string;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  status: string;
  notes: string | null;
  item_title: string | null;
  item_identifier: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string | null;
  is_read: number;
  created_at: string;
}
