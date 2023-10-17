import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface props {
  isObjectButtonPressed: boolean;
  setCoordinates: Dispatch<SetStateAction<number[]>>;
  addObjectToScene: (type: string, props?: any) => void;  // For adding objects
  objectTypePressed: string;
}

export function RayCaster({isObjectButtonPressed, setCoordinates, addObjectToScene, objectTypePressed}: props){
  const world = useThree()
  const mouseCords = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  useEffect(() => {
    const handleClick = (event) => {
      const intersect = raycaster.intersectObject(world.scene.getObjectByName("grid-plane-hidden-helper"));
      if (isObjectButtonPressed && intersect.length > 0) {
        let pointIntersect = intersect[0].point ;
        switch (objectTypePressed) {
          case 'cube':
            pointIntersect.setY(pointIntersect.y + 0.5);
            addObjectToScene('cube', { position: pointIntersect });
            break;
          case 'sphere':
            pointIntersect.setY(pointIntersect.y + 0.7);
            addObjectToScene('sphere', { position: pointIntersect });
            break;
          case 'cylinder':
            pointIntersect.setY(pointIntersect.y + 0.5);
            addObjectToScene('cylinder', { position: pointIntersect });
            break;
          case 'cone':
            pointIntersect.setY(pointIntersect.y + 0.5);
            addObjectToScene('cone', { position: pointIntersect });
            break;
          case 'tetrahedron':
            pointIntersect.setY(pointIntersect.y + 0.5);
            addObjectToScene('tetrahedron', { position: pointIntersect });
            break;
          case 'pyramid':
            pointIntersect.setY(pointIntersect.y + 0.5);
            addObjectToScene('pyramid', { position: pointIntersect });
            break;
          case 'hemisphere':
            pointIntersect.setY(pointIntersect.y + 0.7);
            addObjectToScene('hemisphere', { position: pointIntersect });
            break;
          default:
            console.log("Unknown object type");
        }
      }
    };

    const handleMouseMove = (event) => {
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      mouseCords.x = event.clientX / sizes.width * 2 - 1
      mouseCords.y = - (event.clientY / sizes.height) * 2 + 1
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isObjectButtonPressed, addObjectToScene, raycaster, world.scene]);

  useFrame(({ gl, scene, camera }) => {
    if(!isObjectButtonPressed){
      setCoordinates([camera.position.x, camera.position.y, camera.position.z])
    }

    if(isObjectButtonPressed){
      raycaster.setFromCamera(mouseCords, camera)
      let objectFound = world.scene.getObjectByName("grid-plane-hidden-helper")
      const intersect = raycaster.intersectObject(objectFound)

      if(intersect.length > 0){
        ActiveToolOverLay(objectTypePressed, intersect[0].point.x, intersect[0].point.z, scene)
      }
    }

    gl.render(scene, camera)

    if(isObjectButtonPressed){
      DestroyActiveToolOverlay(objectTypePressed, scene)
    }
  }, 1);

  return null;
}

function ActiveToolOverLay(currTool: string, pointX: number, pointZ: number, scene: Object){
  switch (currTool){
    
    case "cube": {
      var geometry = new THREE.PlaneGeometry(1, 1); // Width and height of the plane
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Green color
        side: THREE.DoubleSide // It's visible from both sides
      });
      var plane = new THREE.Mesh(geometry, material);
          
      plane.name = "temp plane"; // Set the name property of the plane
      plane.rotation.x = Math.PI / 2;
         
      // Set the position of the plane
      plane.position.set(pointX, -.01, pointZ); 
          
      scene.add(plane);
      break;
    }

    case "sphere": {
      const geometry = new THREE.CircleGeometry(0.7, 32); // Using CircleGeometry for the overlay
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.name = "temp circle";
      circle.rotation.x = Math.PI / 2;
      circle.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(circle);
      break;
    }

    case "cylinder": {
      const geometry = new THREE.CircleGeometry(0.5, 32); // Adjust the radius based on your cylinder's size
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, side: 
        THREE.DoubleSide 
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.name = "temp cylinder";
      circle.rotation.x = Math.PI / 2;
      circle.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(circle);
      break;
    }

    case "cone": {
      const geometry = new THREE.CircleGeometry(0.5, 32); // Using CircleGeometry for the cone overlay
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.name = "temp cone-circle";
      circle.rotation.x = Math.PI / 2;
      circle.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(circle);
      break;
    }

    case "tetrahedron": {
      const geometry = new THREE.CircleGeometry(0.6, 3); // Using CircleGeometry with 3 segments to represent a triangle
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const triangle = new THREE.Mesh(geometry, material);
      triangle.name = "temp triangle";
      triangle.rotation.x = Math.PI / 2;
      triangle.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(triangle);
      break;
    }

    case "pyramid": {
      const geometry = new THREE.CircleGeometry(0.5, 4); // Using CircleGeometry with 4 segments to represent pyramid base
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const pyramidBase = new THREE.Mesh(geometry, material);
      pyramidBase.name = "temp pyramidBase";
      pyramidBase.rotation.x = Math.PI / 2;
      pyramidBase.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(pyramidBase);
      break;
    }

    case "hemisphere": {
      const geometry = new THREE.CircleGeometry(0.7, 32); // Using CircleGeometry for the overlay
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.name = "temp hemisphere";
      circle.rotation.x = Math.PI / 2;
      circle.position.set(pointX, 0.01, pointZ); // Slightly above the grid
      scene.add(circle);
      break;
    }
  
    default: {
      console.log("Could not overlay current tool")
      break;
    }
  }
}

function DestroyActiveToolOverlay(currTool: string, scene: Object){
  switch (currTool){

    case "cube":{
      var existingPlane = scene.getObjectByName("temp plane");
      // If it exists, remove it from the scene
      if(existingPlane){
        scene.remove(existingPlane);

        // If you've created the plane using the Mesh object,
        // you'd also want to dispose of the geometry and material to ensure that you're freeing up the memory.
        existingPlane.geometry.dispose();
        existingPlane.material.dispose();
      }
      break;
    }

    case "sphere": {
      const existingCircle = scene.getObjectByName("temp circle");
      if (existingCircle) {
        scene.remove(existingCircle);
        existingCircle.geometry.dispose();
        existingCircle.material.dispose();
      }
      break;
    }

    case "cylinder": {
      const existingCylinder = scene.getObjectByName("temp cylinder");
      if (existingCylinder) {
        scene.remove(existingCylinder);
        existingCylinder.geometry.dispose();
        existingCylinder.material.dispose();
      }
      break;
    }

    case "cone": {
      const existingConeCircle = scene.getObjectByName("temp cone-circle");
      if (existingConeCircle) {
        scene.remove(existingConeCircle);
        existingConeCircle.geometry.dispose();
        existingConeCircle.material.dispose();
      }
      break;
    }

    case "tetrahedron": {
      const existingTriangle = scene.getObjectByName("temp triangle");
      if (existingTriangle) {
        scene.remove(existingTriangle);
        existingTriangle.geometry.dispose();
        existingTriangle.material.dispose();
      }
      break;
    }

    case "pyramid": {
      const existingPyramidBase = scene.getObjectByName("temp pyramidBase");
      if (existingPyramidBase) {
        scene.remove(existingPyramidBase);
        existingPyramidBase.geometry.dispose();
        existingPyramidBase.material.dispose();
      }
      break;
    }

    case "hemisphere": {
      const existingHemisphere = scene.getObjectByName("temp hemisphere");
      if (existingHemisphere) {
        scene.remove(existingHemisphere);
        existingHemisphere.geometry.dispose();
        existingHemisphere.material.dispose();
      }
      break;
    }

    default: {
      console.log(currTool)
      console.log("Could not delete active tool")
      break;
    }
  }
}
