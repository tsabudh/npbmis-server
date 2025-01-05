import { Router } from 'express';

import {
  getHasUnread,
  getNotifications,
  getRoleWiseNotifications,
} from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = Router();

router.get('/get', verifyToken, getNotifications);
router.get('/tasks', verifyToken, getRoleWiseNotifications);
router.get('/unread', verifyToken, getHasUnread);

export default router;
