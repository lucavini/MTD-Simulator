import { Router } from 'express';
import ServiceController from './controller/ServiceController';

const route = Router();
route.get('/', ServiceController.requestService);

export default route;
