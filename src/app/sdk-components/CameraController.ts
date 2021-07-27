import { Vector3 } from '../../mp/sdk';
import { clamp } from '../utils';

type Euler = {
	x: number;
	y: number;
	z: number;
  order: string;
};

interface CameraControllerInputs {
  curve: any, 
  speed: number, 
  verticalOffset: number, 
  enabled: boolean, 
  changeUCallback: (u: number) => void, 
}

interface CameraControllerOutputs {
  camera: any,
}

class CameraController {

  private u: number = 0; // number in [0, 1] representing position along curve
  private length: number = 0; // length of curve
  private up: undefined | Vector3;

  private inputs: CameraControllerInputs = {
    curve: null, // THREE.Curve object
    speed: 1.5, // speed in meters per second
    verticalOffset: 1., // vertical offset from curve
    enabled: false, // true to move forward automatically, false to pause
    changeUCallback: (u) => null, // callback eahc time u changes
  };

  private outputs = {
    camera: null,
  } as CameraControllerOutputs;

  private context: any;

  /**
   * Given u along curve, return position and rotation for camera.
   */
  private getPoseAt(u: number): {position: Vector3, rotation: Euler} {
    const { curve, speed, verticalOffset } = this.inputs;
    const THREE = this.context.three;
    // position
    const uPast = Math.max(u - 0.1 * speed / this.length, 0); // 0.1 second in past
    const uFuture = Math.min(u + speed / this.length, 1); // 1 second in the future
    const position = curve.getPointAt(u);
    position.y += verticalOffset; // add vertical offset;
    const positionPast = curve.getPointAt(uPast);
    const positionFuture = curve.getPointAt(uFuture);
    // rotation
    const matrix = new THREE.Matrix4().lookAt(positionPast, positionFuture, this.up);
    const rotation = new THREE.Euler().setFromRotationMatrix(matrix, "YXZ");
    return { position, rotation };
  }

  /**
   * Set camera pose.
   */
  private setCamera(position: Vector3, rotation: Euler) {
    const { camera } = this.outputs;
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    camera.updateProjectionMatrix();
  }

  /**
   * Manually set u for camera.
   */
  public setU(u: number) {
    this.u = u;
    const { position, rotation } = this.getPoseAt(u);
    this.setCamera(position, rotation);
    this.inputs.changeUCallback(u);
  }

  // --- IComponent methods ----------------------------------------------------

  public onInit = async () => {
    const { curve } = this.inputs;
    const THREE = this.context.three;

    const camera = new THREE.PerspectiveCamera( 45, 1.333, 1, 1000 );
    this.outputs.camera = camera;
    this.length = curve.getLength() - 1;
    this.up = new THREE.Vector3(0, 1, 0);
  };

  public onTick = async (tickDelta: number) => {
    const { speed, enabled } = this.inputs;
    if (enabled) {
      this.u = clamp(this.u + speed * (tickDelta/1000) / this.length, 0, 1);
      const { u } = this;
      const { position, rotation } = this.getPoseAt(u);
      this.setCamera(position, rotation);
      this.inputs.changeUCallback(u);
    }
  };

  public onDestroy = function() {
  };
}

export const cameraControllerType = 'sdk-component.cameraController';
export function CameraControllerFactory() {
  return new CameraController();
}
