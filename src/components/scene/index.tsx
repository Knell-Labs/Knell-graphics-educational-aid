import React, { useState, useEffect, useRef } from "react";
import SceneCanvas from "./canvas";

import { getCreateShape } from "../objects/createShape";

import { CameraSwitch } from "../ui/button/cameraSwitch";
import { Help } from "../ui/button/help";
import { ToolPanel } from "../ui/tool-panel/toolPanel";
import { LeftPanel } from "../ui/left-panel/leftPanel";
import { RightPanel } from "../ui/right-panel/rightPanel";
import { STLImporter } from "../ui/button/importSTL";
import { CustomShapePanel } from "../ui/custom-shape-panel/customShapePanel";

import { Session } from "@/types/auth";
import { ShapeType, ShapeProps, CylindricalHole, Point} from "@/types/scene";


import { CustomShapes } from "../objects/CustomShapes";

interface SceneProps {
  session: Session | null;
  handleLogout: () => void;
  handleShowLoginForm: () => void;
}

const Scene: React.FC<SceneProps> = ({
  session,
  handleLogout,
  handleShowLoginForm,
}) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Mesh | null>(null);
  const [mainCanvasView, setMainCanvasView] = useState<boolean>(false);

  const [objectClicked, setObjectClicked] = useState<THREE.Mesh | null>();
  const [objectClickedUUID, setObjectClickedUUID] = useState<string | null>();

  const [isOrthographic, setIsOrthographic] = useState<boolean>(false);

  const [isObjectButtonPressed, setIsObjectButtonPressed] =
    useState<boolean>(false);
  const [objectTypePressed, setObjectTypePressed] = useState<string>("");

  const [openGroupIDs, setOpenGroupIDs] = useState<string[]>([]);

  const [sceneInfo, setSceneInfo] = useState(null);
  const [sceneMain, setSceneMain] = useState(null);

  const [isSketchButtonPressed, setIsSketchButtonPressed] =
    useState<boolean>(false);

  const [objects, setObjects] = useState<any[]>([]);

  const [lineHistory, setLineHistory] = useState<Point[]>([]);
  const [holeHistory, setHoleHistory] = useState< CylindricalHole[]>([]);
  const [extrudeActivated, setExtrudeActivated] = useState<boolean>(true);
  const [sceneExp, setSceneExp] = useState<THREE.Scene | null>(null);

  // const addObjectToScene = (shapeType: ShapeType, props: ShapeProps = {}) => {
  //   setObjects(prevObjects =>
  //     [
  //       {
  //         type: shapeType,
  //         props
  //       },
  //       ...prevObjects
  //     ]
  //   );
  // };

  const addObjectToScene = (shapeType: ShapeType, props: ShapeProps = {}) => {
    const Shape = !!props.mesh ? STLImporter : getCreateShape(shapeType);
    if (!Shape) return;

    setObjects((prevObjects) => [
      {
        type: shapeType,
        props: props,
        node: (
          <Shape
            key={objects.length.toString() + Date.now().toString()}
            setObjectClickedUUID={setObjectClickedUUID}
            setObjectClicked={setObjectClicked}
            isObjectButtonPressed={
              !!props.mesh ? isObjectButtonPressed : !isObjectButtonPressed
            }
            {...props}
          />
        ),
      },
      ...prevObjects,
    ]);
  };

  return (
    <>
      {mainCanvasView ? (
        <SceneCanvas
          objects={objects}
          addObjectToScene={addObjectToScene}
          isOrthographic={isOrthographic}
          setIsOrthographic={setIsOrthographic}
          setObjectClickedUUID={setObjectClickedUUID}
          setObjectClicked={setObjectClicked}
          objectTypePressed={objectTypePressed}
          setObjectTypePressed={setObjectTypePressed}
          isObjectButtonPressed={isObjectButtonPressed}
          setSceneInfo={setSceneInfo}
          setSceneMain={setSceneMain}
          isSketchButtonPressed={isSketchButtonPressed}
          setSceneExp={setSceneExp}
        />
      ) : (
        <SceneCanvas
          // objects={objects}
          addObjectToScene={addObjectToScene}
          isOrthographic={isOrthographic}
          setIsOrthographic={setIsOrthographic}
          setObjectClickedUUID={setObjectClickedUUID}
          setObjectClicked={setObjectClicked}
          objectTypePressed={objectTypePressed}
          setObjectTypePressed={setObjectTypePressed}
          isObjectButtonPressed={isObjectButtonPressed}
          setSceneInfo={setSceneInfo}
          setSceneMain={setSceneMain}
          isSketchButtonPressed={isSketchButtonPressed}
          setSceneExp={setSceneExp}
        />
      )}

      {mainCanvasView ? (
        <>
          {!!sceneInfo && (
            <>
              {!!objectClicked && !!objectClickedUUID && (
                <RightPanel
                  objectClicked={objectClicked}
                  objectClickedUUID={objectClickedUUID}
                  sceneInfo={sceneInfo}
                />
              )}

              <LeftPanel
                sceneMain={sceneMain}
                sceneInfo={sceneInfo}
                openGroupIDs={openGroupIDs}
                handleOpenGroup={(group_id: string) =>
                  setOpenGroupIDs((prev) =>
                    openGroupIDs.includes(group_id)
                      ? prev.filter((n) => n != group_id)
                      : [...prev, group_id],
                  )
                }
              />
            </>
          )}
          <ToolPanel
            session={session}
            handleLogout={handleLogout}
            handleShowLoginForm={handleShowLoginForm}
            objectTypePressed={objectTypePressed}
            isObjectButtonPressed={isObjectButtonPressed}
            setIsObjectButtonPressed={setIsObjectButtonPressed}
            setObjectTypePressed={setObjectTypePressed}
            setObjectClicked={setObjectClicked}
            addObjectToScene={addObjectToScene}
            isSketchButtonPressed={isSketchButtonPressed}
            setIsSketchButtonPressed={setIsSketchButtonPressed}
            exportedScene={sceneExp}
          />

          <CameraSwitch
            isOrthographic={isOrthographic}
            setIsOrthographic={setIsOrthographic}
            isObjectButtonPressed={isObjectButtonPressed}
          />
          <Help />
        </>
      ) : (
        <>
          <CustomShapePanel 
              lineHistory={lineHistory}   
              setLineHistory={setLineHistory}
              holeHistory={holeHistory}
              setHoleHistory={setHoleHistory}
              extrude={extrudeActivated}
              setExtrude={setExtrudeActivated}
          />

 
          <CustomShapes
              lineHistory={lineHistory}   
              setLineHistory={setLineHistory}
              holeHistory={holeHistory}
              setHoleHistory={setHoleHistory}
              extrudeActivated={extrudeActivated}
              setExtrudeActivated={setExtrudeActivated}
          />
        </>
      )}
    </>
  );
};

export default Scene;


/*
 
          <CustomShapes
              lineHistory={lineHistory}   
              setLineHistory={setLineHistory}
              holeHistory={holeHistory}
              setHoleHistory={setHoleHistory}
              extrudeActivated={extrudeActivated}
              setExtrudeActivated={setExtrudeActivated}
          />
 
*/
