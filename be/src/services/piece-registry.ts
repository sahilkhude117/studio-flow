
class PieceRegistry {
    private pieces: Map<string, any> = new Map();

    registerPiece(name: string, piece: any): void {
        this.pieces.set(name, piece)
    }

    getPiece(name: string): any | undefined {
        return this.pieces.get(name);
    }

    getAllPieces(): Record<string, any> {
        const result: Record<string, any> = {};
        this.pieces.forEach((piece, name) => {
          result[name] = piece;
        });
        return result;
    }

    getPiecesList(): Array<{ name: string, displayName: string, logoUrl: string }> {
        const result: Array<{ name: string, displayName: string, logoUrl: string}> = [];
        this.pieces.forEach((piece, name) => {
          result.push({
            name,
            displayName: piece.displayName,
            logoUrl: piece.logoUrl
          });
        });
        return result;
    }

    getPieceActions(pieceName: string): string[] | undefined {
        const piece = this.getPiece(pieceName);
        if (!piece) return undefined;
        
        return Object.keys(piece._actions);
    }

    getPieceTriggers(pieceName: string): string[] | undefined {
        const piece = this.getPiece(pieceName);
        if (!piece) return undefined;
        
        return piece.triggers ? Object.keys(piece._triggers) : [];
    }
}

export const pieceRegistry = new PieceRegistry();