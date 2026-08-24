import 'server-only';
import { getDb } from '../data/store';
import { nextId } from '../data/ids';
import { NotificationKind } from '../types';

export async function notify(
  userId: string,
  input: { kind: NotificationKind; messageKey: string; params?: Record<string, string | number>; href?: string }
) {
  const db = await getDb();
  db.notifications.unshift({
    id: nextId('notif'),
    userId,
    kind: input.kind,
    messageKey: input.messageKey,
    params: input.params,
    href: input.href,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function listNotifications(userId: string) {
  const db = await getDb();
  return db.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function unreadCount(userId: string) {
  const db = await getDb();
  return db.notifications.filter((n) => n.userId === userId && !n.read).length;
}

export async function markAllRead(userId: string) {
  const db = await getDb();
  db.notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
}

export async function markRead(userId: string, id: string) {
  const db = await getDb();
  const n = db.notifications.find((x) => x.id === id && x.userId === userId);
  if (n) n.read = true;
}
