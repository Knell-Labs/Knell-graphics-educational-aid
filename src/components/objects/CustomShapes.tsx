import React, { useRef, useMemo, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CylindricalHole, Point} from "@/types/scene";


type CustomShapePanelProps = {
    lineHistory: Point[];
    setLineHistory : Dispatch<SetStateAction<Point[]>>;
    holeHistory : CylindricalHole[];
    setHoleHistory : Dispatch<SetStateAction<CylindricalHole[]>>;
    extrudeActivated : boolean;
    setExtrudeActivated: Dispatch<SetStateAction<boolean>>;
}


export function CustomShapes(props: CustomShapePanelProps) {
  const {lineHistory, setLineHistory, holeHistory, setHoleHistory, extrudeActivated, setExtrudeActivated} = props;
  const [lineHistoryIndex, setLineHistoryIndex] = useState<number>(0);
  const [holeHistoryIndex, setHoleHistoryIndex] = useState<number>(0);

  const mesh = useRef();

  const length = 4, width = 4;

  // Create the main shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(length, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  // Define the hole
  const hole = new THREE.Path();
  hole.moveTo( 0, 2 )
  .quadraticCurveTo( 2, 4, 4, 2)
  //.bezierCurveTo(5, 2.5, 5, 3, 4, 4)
  //.quadraticCurveTo( 2, 6, 0, 4)
  //.quadraticCurveTo(-.5, 3, 0, 2)

  //hole.moveTo( 2, 2 ).absarc( 1, 1, .5, 0, Math.PI , true );
  //const holeRadius = 2; // Set the radius of the hole
  //const holePositionX = length / 2 + 1; // Center of the shape in X
  //const holePositionY = width / 2 + 1;  // Center of the shape in Y
  //hole.absarc(holePositionX, holePositionY, holeRadius, 0, Math.PI * 2, false);

  // Add the hole to the shape
  shape.holes.push(hole);

  // Define the extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 1,
    bevelSegments: 12
  };

  // Create the geometry with the hole
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  function custom(){
    return(
      <>
        <mesh
          ref={mesh}
          geometry={geometry}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial attach="material" color={0x00ff00} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial attach="material" color={0x000000} />
        </lineSegments>
      </>
    )
  }


  useEffect(() => {
    console.log(extrudeActivated);
  })

  return true ? custom() : <></>;
};
