declare module "react-simple-maps" {
  import { ComponentType } from "react";

  export interface ComposableMapProps {
    projection?: string | ((...args: unknown[]) => unknown);
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: {
      geographies: Array<{
        rsmKey: string;
        properties?: Record<string, unknown>;
        svgPath?: string;
      }>;
    }) => React.ReactNode;
  }

  export interface GeographyProps {
    geography: {
      rsmKey: string;
      properties?: Record<string, unknown>;
      svgPath?: string;
    };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
