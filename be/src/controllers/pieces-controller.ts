import { Request, Response } from "express";    
import { pieceRegistry } from "../services/piece-registry"; 

export type PieceParams = { pieceName: string };
export type ActionParams = { pieceName: string; actionName: string };

export interface RunActionBody {
  auth: any;
  props: any;
}

export interface ValidateAuthBody {
  auth: any;
}

export const piecesController = {

    async listPieces(req: Request, res: Response): Promise<void> {
        try {
            const pieces = pieceRegistry.getPiecesList();
            res.json({
                success: true,
                data: pieces
            });
        } catch (error) {
            res.status(500).json({
              success: false,
              error: 'Failed to list pieces'
            });
        }
    },

    async getPieceDetails(req: Request<PieceParams>, res: Response):Promise<void> {
        try {
            const { pieceName } = req.params;
            const piece = pieceRegistry.getPiece(pieceName);

            if (!piece) {
                res.status(404).json({
                  success: false,
                  error: `Piece '${pieceName}' not found`
                });
                return;
            }

            const actions = pieceRegistry.getPieceActions(pieceName);
            const triggers = pieceRegistry.getPieceTriggers(pieceName);

            res.json({
                success: true,
                data: {
                  piece,
                  displayName: piece.displayName,
                  description: piece.description,
                  logoUrl: piece.logoUrl,
                  actions,
                  triggers,
                  auth: piece.auth ? {
                    type: piece.auth.type,
                    description: piece.auth.description,
                    required: piece.auth.required
                  } : null
                }
            });
        } catch(error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get piece details'
            });
        }
    },

    async runPieceAction(req: Request<ActionParams, any, RunActionBody>, res: Response):Promise<void> {
        try {
            const { pieceName, actionName } = req.params;
            const { auth, props } = req.body;

            const piece = pieceRegistry.getPiece(pieceName)
            if (!piece) {
                res.status(404).json({
                    success: false,
                    error: `Piece '${pieceName}' not found!`
                });
                return;
            }

            const action = piece._actions[actionName];
            if (!action) {
                res.status(404).json({
                    success: false,
                    error: `Action '${actionName}' not found in piece '${pieceName}'`
                });
                return;
            }

            if (piece.auth && !auth) {
                res.status(400).json({
                  success: false,
                  error: 'Authentication required'
                });
                return;
            }

            const result = await action.run({
                auth,
                propsValue: props
            });

            res.json({
                success: true,
                data: result
            });
        }catch (error: any) {
            res.status(500).json({
              success: false,
              error: error.message || 'Failed to run action'
            });
        }
    },

    async validatePieceAuth(req: Request<PieceParams, any, ValidateAuthBody>, res: Response):Promise<void> {
        try {
            const { pieceName } = req.params;
            const { auth } = req.body;
            
            const piece = pieceRegistry.getPiece(pieceName);
            if (!piece) {
                res.status(404).json({
                success: false,
                error: `Piece '${pieceName}' not found`
                });
                return
            }

            if (!piece.auth) {
                res.status(400).json({
                  success: false,
                  error: `Piece '${pieceName}' does not require authentication`
                });
                return
            }
              
              // Find the authentication property that has a validate function
            let validationResult = { valid: true };
            for (const propKey in piece.auth.props) {
                const prop = piece.auth.props[propKey];
                if (prop.validate) {
                  validationResult = await prop.validate({ auth });
                  break;
                }
            }

            res.json({
                success: true,
                data: validationResult
            });
        }catch (error: any) {
            res.status(500).json({
              success: false,
              error: error.message || 'Failed to validate authentication'
            });
        }
    },
}