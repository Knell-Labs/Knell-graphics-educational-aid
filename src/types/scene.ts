import { Mesh } from "three";

export enum CameraDirection {
  freeDrive,
  redTop, // Normal vector (0, 1, 0)
  redBottom, // Normal vector (0, -1, 0)
  greenFront, // Normal vector (0, 0, 1)
  greenBack, // Normal vector (0, 0, -1)
  blueFront, // Normal vector (1, 0, 0)
  blueBack, // Normal vector (-1, 0, 0)
}
export type TwoDimPlaneRotation = [number, number, number];

export type ShapeType =
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone"
  | "pyramid"
  | "hemisphere"
  | "tetrahedron";

export interface ShapeProps {
  mesh?: Mesh;
  color?: string;
  radius?: number;
  height?: number;
  radialSegments?: number;

  size?: number | [number, number, number];

  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];

  // position?: THREE.Vector3Tuple; // Add position as a Vector3Tuple

  // Add more props as needed
}

export interface ShapeObject {
  type: ShapeType;
  props?: ShapeProps;
}


export interface Point {
    x: number;
    y: number;
}

export interface CylindricalHole {
    x: number;
    y: number;
    radius: number;
    startAngle: number,
    endAngle: number;
    clockWise: boolean;
}



