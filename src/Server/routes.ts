import { Router } from 'express';
import ServerServiceController from './services/serverServiceController';

const route = Router();

route.get('/proxy', ServerServiceController.requestService);

export default route;
