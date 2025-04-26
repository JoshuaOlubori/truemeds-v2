declare module 'react-leaflet-heatmap-layer-v3' {
    import { LayerProps } from "react-leaflet";
    // import { LatLngExpression } from "leaflet";
    import * as React from 'react'; // Add React import
  
    export interface HeatmapLayerProps extends LayerProps {
      points: Array<[number, number, number]>;
      longitudeExtractor: (point: [number, number, number]) => number;
      latitudeExtractor: (point: [number, number, number]) => number;
      intensityExtractor: (point: [number, number, number]) => number;
      radius?: number;
      max?: number;
      minOpacity?: number;
    }
  
    // Use React.Component or React.FC depending on how the original component is defined
    // Class component:
     export class HeatmapLayer extends React.Component<HeatmapLayerProps> {}
    // Functional component might also be possible, but class is more common for older React-Leaflet layers:
    // export const HeatmapLayer: React.FC<HeatmapLayerProps>;
  
  }