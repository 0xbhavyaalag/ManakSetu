const API_BASE = 'http://localhost:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'API error occurred' }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API Call failed [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (phone: string, role: string = 'farmer') =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ phone, role }) }),
  verifyOtp: (phone: string, otp: string, role: string = 'farmer') =>
    request<any>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp, role }) }),
  getCurrentUser: () =>
    request<any>('/auth/me'),

  // Centres & Recommendations
  getCentres: (crop?: string) =>
    request<any[]>(`/centres${crop ? `?crop_name=${encodeURIComponent(crop)}` : ''}`),
  getRecommendations: (crop: string = 'Wheat') =>
    request<any[]>(`/centres/recommendations?crop=${encodeURIComponent(crop)}`),
  getCentre: (id: number) =>
    request<any>(`/centres/${id}`),

  // Bookings
  getBookings: () =>
    request<any[]>('/bookings'),
  getBooking: (id: number) =>
    request<any>(`/bookings/${id}`),
  createBooking: (data: {
    centre_id: number;
    slot_id: number;
    crop_name: string;
    quantity_quintals: number;
    visiting_member_id?: number | null;
    notes?: string;
  }) =>
    request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  rescheduleBooking: (id: number, data: { new_slot_id: number; new_date?: string; reason?: string }) =>
    request<any>(`/bookings/${id}/reschedule`, { method: 'PATCH', body: JSON.stringify(data) }),
  cancelBooking: (id: number) =>
    request<any>(`/bookings/${id}`, { method: 'DELETE' }),

  // Queue
  getQueueStatus: (bookingId: number) =>
    request<any>(`/queue/${bookingId}`),
  getCentreQueueOverview: (centreId: number) =>
    request<any>(`/queue/centre/${centreId}`),
  callNextToken: (centreId: number) =>
    request<any>(`/queue/centre/${centreId}/call-next`, { method: 'POST' }),

  // Family Management
  getFamily: (idOrCode: string = 'F101') =>
    request<any>(`/families/${idOrCode}`),
  addFamilyMember: (familyId: number, member: {
    name: string;
    relationship_to_head: string;
    phone: string;
    device_type: string;
    is_authorized: boolean;
  }) =>
    request<any>(`/families/${familyId}/members`, { method: 'POST', body: JSON.stringify(member) }),
  updateFamilyMember: (familyId: number, memberId: number, data: any) =>
    request<any>(`/families/${familyId}/members/${memberId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  verifyRepresentative: (bookingId: number) =>
    request<any>(`/families/verify-representative/${bookingId}`),

  // Procurement
  getProcurement: (bookingId: number) =>
    request<any>(`/procurement/${bookingId}`),
  updateProcurementStatus: (bookingId: number, data: any) =>
    request<any>(`/procurement/${bookingId}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Payments
  getPayment: (bookingId: number) =>
    request<any>(`/payments/${bookingId}`),
  releasePayment: (bookingId: number, status: string = 'paid') =>
    request<any>(`/payments/${bookingId}/release?status=${status}`, { method: 'PATCH' }),

  // Notifications
  getNotifications: (channel?: string) =>
    request<any[]>(`/notifications${channel ? `?channel=${channel}` : ''}`),
  markNotificationRead: (id: number) =>
    request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),

  // AI & RAG
  chatAI: (message: string, language: string = 'en', bookingId?: number) =>
    request<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, language, booking_id: bookingId }) }),
  getPreVisitCheck: (bookingId: number = 1) =>
    request<any>(`/ai/pre-visit-check?booking_id=${bookingId}`),

  // IVR & Missed Call
  startIvrCall: (phone: string = '9876543210', language: string = 'hi') =>
    request<any>('/ivr/call', { method: 'POST', body: JSON.stringify({ caller_phone: phone, language }) }),
  sendIvrDigit: (sessionId: string, digit: string, phone: string = '9876543210') =>
    request<any>('/ivr/input', { method: 'POST', body: JSON.stringify({ session_id: sessionId, digit, caller_phone: phone }) }),
  sendMissedCall: (phone: string = '9876543210') =>
    request<any>('/ivr/missed-call', { method: 'POST', body: JSON.stringify({ phone }) }),

  // Admin
  getAdminDashboard: () =>
    request<any>('/admin/dashboard'),
  getAuditLogs: () =>
    request<any[]>('/admin/audit-logs'),

  // Demo Tour
  resetDemo: () =>
    request<any>('/demo/reset', { method: 'POST' }),
  executeDemoStep: (stepNumber: number) =>
    request<any>(`/demo/step/${stepNumber}`, { method: 'POST' })
};
