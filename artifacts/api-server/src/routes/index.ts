import { Router, type IRouter } from "express";
import healthRouter from "./health";
import predictionsRouter from "./predictions";
import diseasesRouter from "./diseases";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(predictionsRouter);
router.use(diseasesRouter);
router.use(statsRouter);

export default router;
