import { Router } from 'express';
import ServiceController from './Services/serviceController';

const route = Router();
route.get('/', ServiceController.requestService);

export default route;
