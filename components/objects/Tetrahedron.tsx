import { ThreeElements, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import { Dispatch, SetStateAction } from "react";
import * as THREE from 'three';
import { useCursor } from '@react-three/drei';
import { TransformCustomControls } from "../../components/controls/objectControls/TransformCustomControls";

type CreateTetrahedronProps = {
  setObjectClicked: Dispatch<SetStateAction<THREE.Mesh | null>>;
  isObjectButtonPressed: boolean;
  color?: string;
  size?: number; // Note: Tetrahedron only needs a single size value (radius)
} & ThreeElements['mesh'];

export function CreateTetrahedron({ setObjectClicked,isObjectButtonPressed, color, size = 0.6, ...props }: CreateTetrahedronProps) {
  const tetraRef = useRef<THREE.Mesh>(null!);
  const outlineRef = useRef<THREE.LineSegments>(null!);

  const [hovered, hover] = useState(false);
  const [transformActive, setTransformActive] = useState(false);
  const meshColor = color ? color : (transformActive ? 'white' : 'white');
  const groupRef = useRef<THREE.Group>(null);
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 0x000000, depthTest: true, opacity: 0.5, transparent: true }), []);

  useCursor(hovered);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.type = "TetrahedronGroup";
    }
    if (tetraRef.current && outlineRef.current) {
      outlineRef.current.position.copy(tetraRef.current.position);
      outlineRef.current.rotation.copy(tetraRef.current.rotation);
      outlineRef.current.scale.copy(tetraRef.current.scale);
    }
  });

  return (
    <group ref = { groupRef }>
      <mesh
        {...props}
        ref = { tetraRef }
        rotation = { [(2*Math.PI)/3  + 0.08, (Math.PI)/4, 0] } // Rotate the tetrahedron to sit flat on one of its faces
        onClick= { (event) => {
          if(!isObjectButtonPressed){
              (event.stopPropagation(), setTransformActive(true))
              setObjectClicked(tetraRef.current)
          }
      }}
        onPointerMissed = { (event) => {
          (event.type === 'click' && setTransformActive(false))
          setObjectClicked(null);
       }}
        onPointerOver   = { (event) => (event.stopPropagation(), hover(true)) }
        onPointerOut    = { (event) => hover(false) }
      >
        <tetrahedronGeometry args = { [size] } />
        <meshStandardMaterial color = { meshColor } />
      </mesh>

      {transformActive && <TransformCustomControls mesh = { tetraRef } />}

      <lineSegments ref = { outlineRef } material = { lineMaterial }>
        <edgesGeometry attach = "geometry" args = { [new THREE.TetrahedronGeometry(size)] } />
      </lineSegments>
    </group>
  )
}
