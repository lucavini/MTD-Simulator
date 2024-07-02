import { Router } from 'express';
import AppServiceController from './services/appServiceController';

const route = Router();
route.get('/app', AppServiceController.requestService);

export default route;
