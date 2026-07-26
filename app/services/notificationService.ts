import { MOCK_NOTIFICATIONS, NotificationItem } from '../data/mockNotifications';

export const notificationService = {
  getNotifications(): NotificationItem[] {
    return MOCK_NOTIFICATIONS;
  },
};
