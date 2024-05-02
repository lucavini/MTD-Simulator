import { Router } from 'express';
import ServiceController from './app/controller/ServiceController';

const route = Router();
route.get('/', ServiceController.requestService);

export default route;
