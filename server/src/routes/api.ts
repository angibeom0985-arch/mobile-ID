import { Router } from 'express';
import { getOilPrice, getNearbyStations, getTrafficInfo } from '../controllers/apiController';

const router = Router();

// Oil price endpoint
router.get('/oil-price', getOilPrice);

// Nearby gas stations endpoint
router.get('/nearby-stations', getNearbyStations);

// Traffic info endpoint
router.get('/traffic-info', getTrafficInfo);

export default router;
