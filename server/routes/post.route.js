import express from 'express'
import { createTicket, getTickets, updateTicket} from '../controllers/post.controller.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createTicket', verifyToken, createTicket)
router.get('/getTickets', getTickets)
router.put('/updateTicket/:postId/:userId', verifyToken, updateTicket)

export default router