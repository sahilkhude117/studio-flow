from typing import Dict, Any, List, Type
import importlib
import os

class PieceRegistry:
    """Registry for all available pieces"""

    __pieces = {}

    @classmethod
    def load_pieces(cls):
        """Load all available pieces"""

        pieces_dir = os.path.dirname(__file__)
        for item in os.listdir(pieces_dir):
            if item.startswith('__') or item == 'registry.py':
                continue

            piece_path = os.path.join(pieces_dir, item)
            if os.path.isdir(piece_path):
                try:
                    module = importlib.import_module(f"pieces.{item}")
                    # Find the piece class
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if isinstance(attr, type) and attr_name.endswith('Piece'):
                            cls._pieces[attr.name] = attr
                            break
                except Exception as e:
                    print(f"Failed to load piece {item}: {e}")

    @classmethod
    def get_piece(cls, name: str):
        """Get a piece by name"""
        return cls._pieces.get(name)
    
    @classmethod
    def get_all_pieces(cls):
        """Get all registered pieces"""
        return cls._pieces