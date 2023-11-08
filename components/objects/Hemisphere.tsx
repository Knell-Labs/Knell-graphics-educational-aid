import { ThreeElements, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import { Dispatch, SetStateAction } from "react";
import * as THREE from 'three';
import { useCursor } from '@react-three/drei'
import { TransformCustomControls } from "../../components/controls/objectControls/TransformCustomControls"

type CreateHemisphereProps = {
  setObjectClicked: Dispatch<SetStateAction<THREE.Mesh | null>>;
  isObjectButtonPressed: boolean;
  color?: string;
  radius?: number;
  radialSegments?: number;
} & ThreeElements['mesh'];

export function CreateHemisphere({ setObjectClicked,isObjectButtonPressed, color, radius = 0.5, radialSegments = 32, ...props }: CreateHemisphereProps) {
  const hemisphereRef = useRef<THREE.Mesh>(null!);
  const outlineRef = useRef<THREE.LineSegments>(null!);

  const [hovered, hover] = useState(false);
  const [transformActive, setTransformActive] = useState(false);
  const meshColor = color ? color : (transformActive ? 'white' : 'white');
  const groupRef = useRef<THREE.Group>(null);
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 0x000000, depthTest: true, opacity: 0.5, transparent: true }), []);

  useCursor(hovered)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.type = "HemisphereGroup"
    }
    if (hemisphereRef.current && outlineRef.current) {
      outlineRef.current.position.copy(hemisphereRef.current.position);
      outlineRef.current.rotation.copy(hemisphereRef.current.rotation);
      outlineRef.current.scale.copy(hemisphereRef.current.scale);
    }
  });

  return (
    <group ref = { groupRef }>
      <mesh
        {...props}
        ref = { hemisphereRef }
        rotation = { [-Math.PI / 2, 0, 0] }

        onClick = { (event) => {
          if (!isObjectButtonPressed) {
            (event.stopPropagation(), setTransformActive(true))
            setObjectClicked(hemisphereRef.current)
          }
        } }
        onPointerMissed = { (event) => {
          (event.type === 'click' && setTransformActive(false))
          setObjectClicked(null);
       }}
        onPointerOver   = { (event) => (event.stopPropagation(), hover(true)) }
        onPointerOut    = { (event) => hover(false) }
      >
        <sphereGeometry args = { [radius, radialSegments, radialSegments, 0, Math.PI] } />
        <meshStandardMaterial color = { meshColor } side = { THREE.FrontSide } /> {/* Ensure the material is not double-sided */}
      </mesh>

      {transformActive && <TransformCustomControls mesh = { hemisphereRef } />}

      <lineSegments ref = { outlineRef } material = { lineMaterial }>
        <edgesGeometry attach = "geometry" args = { [new THREE.SphereGeometry(radius, radialSegments, radialSegments, 0, Math.PI)] } />
      </lineSegments>
    </group>
  )
}
