// components/NodeSelector.tsx
import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { fetchPieces, fetchPieceDetails } from '@/lib/apiService';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NodeSelectorProps = {
  type: 'trigger' | 'action';
  onSelect: (nodeData: SelectionData) => void;
};

type PieceInfo = {
  name: string;
  displayName: string;
  logoUrl: string;
};

type PieceAction = {
  name: string;
  displayName: string;
  description: string;
  props: Record<string, any>;
  requireAuth: boolean;
};

type PieceDetails = {
  displayName: string;
  logoUrl: string;
  authors: string[];
  categories: string[];
  description: string;
  auth?: {
    displayName: string;
    required: boolean;
    description: string;
    type: string;
  };
  _actions: Record<string, PieceAction>;
};

export type SelectionData = {
  pieceType: 'trigger' | 'action';
  pieceName: string;
  actionName?: string;
  displayName: string;
  logoUrl: string;
  description: string;
};

export const NodeSelector = ({ type, onSelect }: NodeSelectorProps) => {
  const [pieces, setPieces] = useState<PieceInfo[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [pieceDetails, setPieceDetails] = useState<PieceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPieces = async () => {
      setLoading(true);
      try {
        const response = await fetchPieces();
        setPieces(response);
      } catch (err) {
        setError("Failed to load pieces");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPieces();
  }, []);

  useEffect(() => {
    const loadPieceDetails = async () => {
      if (!selectedPiece) {
        setPieceDetails(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetchPieceDetails(selectedPiece);
        setPieceDetails(response);
      } catch (err) {
        setError(`Failed to load details for ${selectedPiece}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPieceDetails();
  }, [selectedPiece]);

  const handlePieceClick = (pieceName: string) => {
    setSelectedPiece(pieceName);
  };

  const handleActionSelect = (actionName: string) => {
    if (!selectedPiece || !pieceDetails || !pieceDetails._actions[actionName]) return;
    
    const action = pieceDetails._actions[actionName];
    
    onSelect({
      pieceType: 'action',
      pieceName: selectedPiece,
      actionName: actionName,
      displayName: action.displayName,
      logoUrl: pieceDetails.logoUrl,
      description: action.description
    });
  };

  const handleTriggerSelect = () => {
    onSelect({
      pieceType: 'trigger',
      pieceName: 'webhook',
      displayName: 'Webhook',
      logoUrl: 'https://cdn.activepieces.com/pieces/webhook.svg',
      description: 'Trigger your flow with a webhook endpoint'
    });
  };

  const renderActions = () => {
    if (!pieceDetails || !pieceDetails._actions) {
      return <p className="text-gray-500 p-4">No actions available</p>;
    }

    return (
      <div className="grid gap-3 p-4">
        {Object.entries(pieceDetails._actions).map(([actionKey, action]) => (
          <Card 
            key={actionKey} 
            className="border hover:bg-blue-50 cursor-pointer transition-all"
            onClick={() => handleActionSelect(actionKey)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Image
                    src={pieceDetails.logoUrl}
                    alt={pieceDetails.displayName}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{action.displayName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTrigger = () => {
    return (
      <div className="grid gap-3 p-4">
        <Card 
          className="border hover:bg-red-50 cursor-pointer transition-all"
          onClick={handleTriggerSelect}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Image
                  src="https://cdn.activepieces.com/pieces/webhook.svg"
                  alt="Webhook"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Webhook</h4>
                <p className="text-xs text-muted-foreground mt-1">Trigger your flow with a webhook endpoint</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // If type is trigger, just show the webhook trigger option
  if (type === 'trigger') {
    return renderTrigger();
  }

  return (
    <div className="flex h-96 border rounded-lg overflow-hidden shadow-md">
      {/* Left Panel - Pieces List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 bg-white border-b">
          <h2 className="font-semibold text-lg">Available Pieces</h2>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2">
            {loading && !pieces.length ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : (
              pieces.map((piece) => (
                <div
                  key={piece.name}
                  className={`flex items-center p-3 mb-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                    selectedPiece === piece.name ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => handlePieceClick(piece.name)}
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-white border flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={piece.logoUrl}
                      alt={piece.displayName}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="ml-3 font-medium text-sm">{piece.displayName}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Actions */}
      <div className="w-2/3 bg-white">
        {selectedPiece ? (
          <div className="h-full flex flex-col">
            {loading && !pieceDetails ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : pieceDetails ? (
              <>
                <div className="p-4 border-b flex items-center">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-white border flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={pieceDetails.logoUrl}
                      alt={pieceDetails.displayName}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-lg">{pieceDetails.displayName}</h2>
                      {pieceDetails.categories?.map(category => (
                        <Badge key={category} variant="outline" className="text-xs bg-blue-50">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{pieceDetails.description}</p>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  {renderActions()}
                </ScrollArea>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium mb-2">No details available</h3>
                  <p>Unable to load actions for this piece</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🔌</div>
              <h3 className="text-xl font-medium mb-2">Select a piece</h3>
              <p>Choose a piece from the left to view its actions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};