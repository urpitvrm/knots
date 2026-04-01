const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

async function getMessages(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('Invalid user id');
      err.status = 400;
      throw err;
    }
    const requesterId = String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);

    if (!isAdmin && requesterId !== String(userId)) {
      const err = new Error('You can only access your own chat history');
      err.status = 403;
      throw err;
    }

    let query;
    if (isAdmin) {
      query = {
        $or: [
          { senderId: userId, receiverId: { $in: adminIds } },
          { senderId: { $in: adminIds }, receiverId: userId }
        ]
      };
    } else {
      query = {
        $or: [
          { senderId: requesterId, receiverId: { $in: adminIds } },
          { senderId: { $in: adminIds }, receiverId: requesterId }
        ]
      };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    res.json({ success: true, items: messages });
  } catch (err) {
    next(err);
  }
}

async function getAdminChats(req, res, next) {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: { $in: adminIds } }, { receiverId: { $in: adminIds } }]
        }
      },
      {
        $project: {
          senderId: 1,
          receiverId: 1,
          message: 1,
          createdAt: 1,
          userId: {
            $cond: [
              { $in: ['$senderId', adminIds] },
              '$receiverId',
              '$senderId'
            ]
          },
          senderIsAdmin: { $in: ['$senderId', adminIds] }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$userId',
          lastMessage: { $first: '$message' },
          lastMessageAt: { $first: '$createdAt' },
          lastSenderId: { $first: '$senderId' },
          totalMessages: { $sum: 1 },
          lastSenderIsAdmin: { $first: '$senderIsAdmin' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: { _id: '$user._id', name: '$user.name', email: '$user.email' },
          lastMessage: 1,
          lastMessageAt: 1,
          lastSenderId: 1,
          totalMessages: 1,
          lastSenderIsAdmin: 1
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);

    res.json({ success: true, items: chats });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, getAdminChats };
