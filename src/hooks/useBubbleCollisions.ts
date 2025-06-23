
import { useCallback, useRef } from 'react';

interface CollisionQuadrant {
  x: number;
  y: number;
  width: number;
  height: number;
  bubbles: number[];
}

export const useBubbleCollisions = () => {
  const quadrantsRef = useRef<CollisionQuadrant[]>([]);
  
  const initializeQuadrants = useCallback(() => {
    // Divide screen into 4x4 grid for spatial partitioning
    quadrantsRef.current = [];
    const gridSize = 4;
    const quadrantWidth = 100 / gridSize;
    const quadrantHeight = 100 / gridSize;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        quadrantsRef.current.push({
          x: col * quadrantWidth,
          y: row * quadrantHeight,
          width: quadrantWidth,
          height: quadrantHeight,
          bubbles: []
        });
      }
    }
  }, []);

  const getQuadrantIndex = useCallback((x: number, y: number): number => {
    const gridSize = 4;
    const col = Math.floor((x / 100) * gridSize);
    const row = Math.floor((y / 100) * gridSize);
    return Math.max(0, Math.min(15, row * gridSize + col));
  }, []);

  const updateSpatialGrid = useCallback((bubbles: any[]) => {
    // Clear all quadrants
    quadrantsRef.current.forEach(quadrant => {
      quadrant.bubbles = [];
    });
    
    // Assign bubbles to quadrants
    bubbles.forEach(bubble => {
      const quadrantIndex = getQuadrantIndex(bubble.x, bubble.y);
      quadrantsRef.current[quadrantIndex]?.bubbles.push(bubble.id);
    });
  }, [getQuadrantIndex]);

  const getPotentialCollisions = useCallback((bubbleId: number, x: number, y: number): number[] => {
    const quadrantIndex = getQuadrantIndex(x, y);
    const currentQuadrant = quadrantsRef.current[quadrantIndex];
    
    if (!currentQuadrant) return [];
    
    // Get bubbles from current quadrant and adjacent quadrants
    const potentialCollisions: number[] = [];
    const gridSize = 4;
    const row = Math.floor(quadrantIndex / gridSize);
    const col = quadrantIndex % gridSize;
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
          const adjacentIndex = newRow * gridSize + newCol;
          const adjacentQuadrant = quadrantsRef.current[adjacentIndex];
          
          if (adjacentQuadrant) {
            potentialCollisions.push(...adjacentQuadrant.bubbles);
          }
        }
      }
    }
    
    return potentialCollisions.filter(id => id !== bubbleId);
  }, [getQuadrantIndex]);

  return {
    initializeQuadrants,
    updateSpatialGrid,
    getPotentialCollisions
  };
};
