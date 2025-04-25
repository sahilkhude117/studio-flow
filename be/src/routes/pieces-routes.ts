import { Router } from "express";
import { piecesController } from "../controllers/pieces-controller";

const router = Router()

router.get('/', piecesController.listPieces);

router.get<{ pieceName: string }>('/:pieceName', piecesController.getPieceDetails);

router.post<{ pieceName: string, actionName: string }>('/:pieceName/actions/:actionName/run', piecesController.runPieceAction)

router.post<{ pieceName: string }>('/:pieceName/auth/validate', piecesController.validatePieceAuth);

export default router;



