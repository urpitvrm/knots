const Notification = require('../models/Notification');
const { getIO } = require('../socket/socketServer');

async function pushNotification(userId, payload) {
  if (!userId) return null;
  const notification = await Notification.create({
    userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    meta: payload.meta || {}
  });
  const io = getIO();
  if (io) {
    io.to(String(userId)).emit('notification', notification);
  }
  return notification;
}

async function pushNotificationToAdmins(payload) {
  const io = getIO();
  if (io) {
    io.to('admins').emit('notification:admin', payload);
  }
}

function emitRealtimeEvent(roomOrUserId, eventName, payload) {
  const io = getIO();
  if (!io) return;
  io.to(String(roomOrUserId)).emit(eventName, payload);
}

module.exports = {
  pushNotification,
  pushNotificationToAdmins,
  emitRealtimeEvent
};
