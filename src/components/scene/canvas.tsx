import { useEffect, useState, useRef } from "react";
import { Mesh } from "three";

import { Canvas, useThree } from "@react-three/fiber";
import { Plane } from "@react-three/drei";

import { AxesHelper } from "../axesHelperCustom/axesHelper";
import { CustomCameraControls } from "../controls/CameraControls";
import { SwitchBetweenCameras } from "../camera/camera";

import { AmbientLightFunc, DirectLightFunc } from "../objects/Lights";

import { RayCaster } from "../raycast/raycaster";
import { CadPlanes } from "../raycast/ScenePlanes";


import {
  CameraDirection,
  TwoDimPlaneRotation,
  ShapeProps,
  ShapeObject,
} from "@/types/scene";

import { getCreateShape } from "../objects/createShape";
import { CustomShapes } from "../objects/CustomShapes";

interface SceneCanvasProps {
  objects: Array<{
    type: string;
    props: ShapeProps;
  }>;
  addObjectToScene: (type: string, props?: any) => void;

  isOrthographic: boolean;
  setIsOrthographic: (isOrthographic: boolean) => void;
  setObjectClickedUUID: (uuid: string | null) => void;
  setObjectClicked: (mesh: Mesh | null) => void;
  isObjectButtonPressed: boolean;
  setObjectTypePressed: (type: string) => void;
  objectTypePressed: string;
  setSceneInfo: (info: any) => void; // Define more specific type if possible
  setSceneMain: (main: any) => void; // Define more specific type if possible
  isSketchButtonPressed: boolean;
  setSceneExp: (scene: THREE.Scene | null) => void;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  objects,
  addObjectToScene,
  isOrthographic,
  setIsOrthographic,
  setObjectClickedUUID,
  setObjectClicked,
  isObjectButtonPressed,
  setObjectTypePressed,
  objectTypePressed,
  setSceneInfo,
  setSceneMain,
  isSketchButtonPressed,
  setSceneExp,
}) => {
  const [cameraCoordinates, setCameraCoordinates] = useState<number[]>([
    15, 15, 15,
  ]);
  const [fetchedObjects, setFetchedObjects] = useState<boolean>(false);

  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null);

  const [currCameraPos, setCurrCameraPos] = useState<CameraDirection>(
    CameraDirection.freeDrive,
  );

  const [planeOrientation, setPlaneOrientation] = useState<TwoDimPlaneRotation>(
    [-Math.PI / 2, 0, 0],
  );
  const [girdOrientation, setGirdOrientation] = useState<TwoDimPlaneRotation>([
    0, 0, 0,
  ]);

  const GetSceneInfo = () => {
    const { scene } = useThree();
  
    useEffect(() => {
      setSceneInfo(scene.children);
      if (scene.name === "") {
        scene.name = "Untitled";
      }
      setSceneMain(scene);
      setSceneExp(scene); // Update the sceneExp state in the parent component
      if (!fetchedObjects) {
        setFetchedObjects(true);
      }
    }, [objects, setSceneExp]); // Add setSceneExp to the dependency array
  
    return null;
  };

  return (
    <Canvas>
      <AmbientLightFunc />
      <DirectLightFunc isObjectButtonPressed={isObjectButtonPressed} />

      <GetSceneInfo />

      <CustomCameraControls />

      <SwitchBetweenCameras
        isOrthographic={isOrthographic}
        setIsOrthographic={setIsOrthographic}
        cameraCoordinates={cameraCoordinates}
        persCameraRef={perspectiveCameraRef}
        orthoCameraRef={orthographicCameraRef}
      />

      {objects ? (
        objects.map((obj, idx) => {
          return obj.node;
          // const Shape = getCreateShape(obj.type);
          // if (!Shape) return null;
          // <Shape
          //     key                   = { objects.length.toString() + Date.now().toString() }
          //     setObjectClickedUUID  = { setObjectClickedUUID }
          //     setObjectClicked      = { setObjectClicked }
          //     isObjectButtonPressed = { !isObjectButtonPressed }
          //     { ...obj.props }
          // />
        })
      ) : (
        <></>
      )}
      {/* 
            {objects.map((object, idx) => {
                const Shape = getCreateShape(object.type);
                if (!Shape) return null;
                return (
                    <Shape
                        key                   = { `${idx}-${object.uuid}` }
                        setObjectClickedUUID  = { setObjectClickedUUID }
                        setObjectClicked      = { setObjectClicked }
                        isObjectButtonPressed = { isObjectButtonPressed }
                        { ...object.props }
                    />
                )
            })} */}

      {isSketchButtonPressed && (
        <CadPlanes
          isOrthographic={isOrthographic}
          orthoCameraRef={orthographicCameraRef}
          persCameraRef={perspectiveCameraRef}
          planeOrientation={planeOrientation}
          setPlaneOrientation={setPlaneOrientation}
          girdOrientation={girdOrientation}
          setGirdOrientation={setGirdOrientation}
          setCurrCameraPos={setCurrCameraPos}
        />
      )}

      <RayCaster
        isObjectButtonPressed={isObjectButtonPressed}
        addObjectToScene={addObjectToScene}
        setCoordinates={setCameraCoordinates}
        objectTypePressed={objectTypePressed}
        currCameraPos={currCameraPos}
      />

      <color args={["#343a45"]} attach="background" />

      <gridHelper
        name="init-grid"
        args={[20, 20, "#ffffff"]}
        position={[0, -0.01, 0]}
        rotation={[girdOrientation[0], girdOrientation[1], girdOrientation[2]]}
      />

      <Plane
        name="grid-plane-hidden-helper"
        rotation={[
          planeOrientation[0],
          planeOrientation[1],
          planeOrientation[2],
        ]}
        args={[20, 20]}
        position={[0, -0.01, 0]}
        visible={false}
      />

      <AxesHelper width={6} length={2} />
    </Canvas>
  );
};

export default SceneCanvas;
