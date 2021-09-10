import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersControler';
import UseAvatarController from '../controllers/UseAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const useAvatarController = new UseAvatarController();

const upload = multer(uploadConfig.multer);

usersRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  }),
  usersController.create,
);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), useAvatarController.update);

export default usersRouter;