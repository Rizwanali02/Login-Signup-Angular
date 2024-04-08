import { Router } from "express"
import { allUsersController, deleteUserController, editUserController, loginUserController, logoutUserController, signUpUserController } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/signup', signUpUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.get('/allusers', isAuthenticated, allUsersController);
router.put('/updateuser', isAuthenticated, editUserController);
router.delete('/deleteuser/:id', isAuthenticated,  deleteUserController);


export default router;

