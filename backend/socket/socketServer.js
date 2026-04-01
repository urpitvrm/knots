const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const userSocketMap = new Map();
const socketUserMap = new Map();
let ioInstance = null;

function emitOnlineUsers(io) {
  io.emit('online_users', Array.from(userSocketMap.keys()));
}

async function resolveReceiverId(sender, providedReceiverId) {
  if (providedReceiverId) return providedReceiverId;
  if (sender.role === 'admin') return null;
  const admin = await User.findOne({ role: 'admin' }).select('_id');
  return admin ? String(admin._id) : null;
}

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  ioInstance = io;

  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      if (!token) {
        const err = new Error('Authentication required');
        err.data = { status: 401 };
        return next(err);
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id name role');
      if (!user) {
        const err = new Error('User not found');
        err.data = { status: 401 };
        return next(err);
      }
      socket.user = user;
      return next();
    } catch (error) {
      const err = new Error('Invalid token');
      err.data = { status: 401 };
      return next(err);
    }
  });

  io.on('connection', (socket) => {
    const userId = String(socket.user._id);
    userSocketMap.set(userId, socket.id);
    socketUserMap.set(socket.id, userId);
    socket.join(userId);
    if (socket.user.role === 'admin') {
      socket.join('admins');
    }
    emitOnlineUsers(io);

    socket.on('join_room', ({ roomId }) => {
      if (roomId) socket.join(String(roomId));
    });

    socket.on('send_message', async (payload, callback) => {
      try {
        const rawMessage = payload?.message || '';
        const trimmedMessage = rawMessage.trim();
        if (!trimmedMessage) throw new Error('Message cannot be empty');

        const senderId = String(socket.user._id);
        const receiverId = await resolveReceiverId(socket.user, payload?.receiverId);
        if (!receiverId) {
          const err = new Error('Receiver is required');
          err.status = 400;
          throw err;
        }
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
          const err = new Error('Invalid receiver');
          err.status = 400;
          throw err;
        }

        const created = await Message.create({
          senderId,
          receiverId,
          message: trimmedMessage
        });

        const populated = await Message.findById(created._id)
          .populate('senderId', 'name email role')
          .populate('receiverId', 'name email role');

        io.to(senderId).emit('receive_message', populated);
        io.to(String(receiverId)).emit('receive_message', populated);
        io.to(String(receiverId)).emit('new_message', populated);
        await Notification.create({
          userId: receiverId,
          type: 'new_message',
          title: 'New message',
          message: `You received a new message from ${socket.user.name}.`,
          meta: { senderId, messageId: String(populated._id) }
        });
        if (callback) callback({ ok: true, data: populated });
      } catch (error) {
        const message = error.message || 'Failed to send message';
        socket.emit('chat_error', { message });
        if (callback) callback({ ok: false, error: message });
      }
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = socketUserMap.get(socket.id);
      socketUserMap.delete(socket.id);
      if (disconnectedUserId) {
        userSocketMap.delete(disconnectedUserId);
      }
      emitOnlineUsers(io);
    });
  });

  return io;
}

module.exports = { initSocket };

function getIO() {
  return ioInstance;
}

module.exports = { initSocket, getIO };
