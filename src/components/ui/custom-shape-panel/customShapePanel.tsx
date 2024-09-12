import React, { useState, Dispatch, SetStateAction } from "react";
import { CustomShapes } from "../../objects/CustomShapes";

import { CylindricalHole, Point} from "@/types/scene";


type CustomShapePanelProps = {
    lineHistory: Point[];
    setLineHistory : Dispatch<SetStateAction<Point[]>>;
    holeHistory : CylindricalHole[];
    setHoleHistory : Dispatch<SetStateAction<CylindricalHole[]>>;
    extrude : boolean;
    setExtrude : Dispatch<SetStateAction<boolean>>;
}

enum lineField {
  x,
  y,
}

enum holeField {
  x,
  y,
  radius,
  startAngle,
  endAngle,
  clockwise,
}





export function CustomShapePanel(props: CustomShapePanelProps) {

  const {lineHistory, setLineHistory, holeHistory, setHoleHistory, extrude, setExtrude} = props;


  const lineFields = Object.values(lineField).filter((field) =>
    isNaN(Number(field)),
  );
  const holeFields = Object.values(holeField).filter((field) =>
    isNaN(Number(field)),
  );


  const fieldProperty = (
    sectionName: string,
    fields,
    index: boolean,
    colNum: number,
  ) => (
    <div className={`grid grid-cols-${colNum} content-evenly items-center`}>
      {sectionName + " "}
      {index ? lineHistory.length + 1 : ""}
      {Object.values(fields).map((field) => (
        <div
          key={`${sectionName.toLowerCase()}_${field}_${lineHistory.length}`}
          className="flex bg-graySubFill border-2 border-grayFill hover:border-gray-600 active:border-gray-600 rounded m-1"
        >
          <label className="whitespace-nowrap px-2 text-gray-400">
            {field}
          </label>
          <div
            // AS OF NOW, there is only one line of input, thus the id is unique enough
            id={`${sectionName.toLowerCase()}_${field}`}
            contentEditable={true}
            suppressContentEditableWarning={true}
          >
            0
          </div>
        </div>
      ))}
    </div>
  );


  const exturdeSettings = () => {
    //setExtrude(true);
  }

  const addLine = () => {
    const x = document.getElementById("line_x") as HTMLDivElement;
    const y = document.getElementById("line_y") as HTMLDivElement;

    if (x.textContent != null && y.textContent != null) {
      setLineHistory([...lineHistory, { x: x.textContent, y: y.textContent }]);
    }
  };

  const addHole = () => {
    const x = document.getElementById("hole_x") as HTMLDivElement;
    const y = document.getElementById("hole_y") as HTMLDivElement;
    const radius = document.getElementById("hole_radius") as HTMLDivElement;
    const startAngle = document.getElementById(
      "hole_startAngle",
    ) as HTMLDivElement;
    const endAngle = document.getElementById("hole_endAngle") as HTMLDivElement;
    const clockwise = document.getElementById(
      "hole_clockwise",
    ) as HTMLDivElement;

    if (
      x.textContent != null &&
      y.textContent != null &&
      radius.textContent != null &&
      startAngle.textContent != null &&
      endAngle.textContent != null &&
      clockwise.textContent != null
    ) {
      setHoleHistory([
        ...holeHistory,
        {
          x: x.textContent,
          y: y.textContent,
          radius: radius.textContent,
          startAngle: startAngle.textContent,
          endAngle: endAngle.textContent,
          clockwise: clockwise.textContent,
        },
      ]);
    }
    console.log("add Hole");
  };

  const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 20px; 
    height: 20px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #1a1a1a ;
    border-radius: 16px;
    border: 4px solid #3a3b3a; 
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: #3a3b3a;
  }

  ::-webkit-scrollbar-button {
    display:none;
  }
`;

  return (
    <>
      <div className="fixed flex flex-col top-5 bottom-5 right-3 text-sm bg-grayFill rounded-lg">
        <div
          id="line_add"
          className="flex flex-col p-4 w-56 h-full overflow-auto"
        >
          <ul id="line_history" className="flex flex-col grow-0">
            {lineHistory.map((item, index) => (
              <li key={index} className="whitespace-pre">
                {`Line ${index + 1}:         x: ${item.x}          y: ${
                  item.y
                }`}
              </li>
            ))}
          </ul>
          <div>
            {fieldProperty("Line", lineFields, true, 3)}
            {/* {renderDivs()} */}
          </div>

          <button
            className="bg-graySubFill mt-2 hover:bg-blueHover rounded-lg"
            onClick={addLine}
          >
            add line
          </button>
          <button
            className="bg-graySubFill mt-2 hover:bg-blueHover rounded-lg"
            onClick={addLine}
          >
            extrude
          </button>
        </div>{" "}
        {/* end of Add Line */}
        <div className="bg-gray-500 w-full h-0.5 my-3 rounded-lg" />
        <div
          id="hole_add"
          className="flex flex-col p-4 w-56 h-full overflow-auto"
        >
          <style>{scrollbarStyles}</style>
          <ul id="hole_history" className="flex flex-col grow-0">
            {holeHistory.map((item, index) => (
              <li key={index} className="whitespace-pre">
                {`Hole ${index + 1}: x: ${item.x},  y: ${item.y}
radius: ${item.radius},  startAngle: ${item.startAngle},
endAngle: ${item.endAngle},  clockwise: ${item.clockwise}\n \n`}
              </li>
            ))}
          </ul>
          <div>{fieldProperty("Hole", holeFields, false, 2)}</div>
          <button
            className="bg-graySubFill mt-2 hover:bg-blueHover rounded-lg"
            onClick={addHole}
          >
            add hole
          </button>
        </div>
      </div>
    </>
  );
}
