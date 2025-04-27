
export const fetchPieces = async (): Promise<any[]> => {
    try {
      const response = await fetch('http://localhost:5000/api/pieces');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching pieces:', error);
      return [];
    }
};
  
export const fetchPieceDetails = async (pieceName: string): Promise<any | null> => {
    try {
      const response = await fetch(`http://localhost:5000/api/pieces/${pieceName}`);
      const data = await response.json();
      return data.data.piece || null;
    } catch (error) {
      console.error(`Error fetching piece ${pieceName} details:`, error);
      return null;
    }
};