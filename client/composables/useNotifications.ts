import { Notification } from '~/interfaces/utils';

export const useNotifications = (milliseconds = 3000) => {
  const notifications = useState<Notification[]>('notifications', () => []);

  const notify = (notification: Notification) => {
    const id = notifications.value.length + 1;
    notification.id = id;
    notifications.value.push(notification);

    setTimeout(() => {
      close(id);
    }, milliseconds);
  };

  const close = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    notifications.value.splice(index, 1);
  };

  return { notify, notifications, close };
};
