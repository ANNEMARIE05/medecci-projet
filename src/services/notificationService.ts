import { apiFetch } from '../lib/apiFetch';
import type { NotificationMed } from '../types/models';

export const notificationService = {
  recupererNotifications: async (): Promise<NotificationMed[]> => {
    return apiFetch<NotificationMed[]>('/api/notifications');
  },
  marquerNotificationLue: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/notifications/${id}/lu`, { method: 'PUT' });
  },
  effacerNotifications: async (): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>('/api/notifications', { method: 'DELETE' });
  },
};
export default notificationService;
