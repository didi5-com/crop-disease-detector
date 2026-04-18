import { Router, type IRouter } from "express";
import healthRouter from "./health";
import predictionsRouter from "./predictions";
import diseasesRouter from "./diseases";
import diseaseImagesRouter from "./disease-images";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(predictionsRouter);
router.use(diseasesRouter);
router.use(diseaseImagesRouter);
router.use(statsRouter);

export default router;
