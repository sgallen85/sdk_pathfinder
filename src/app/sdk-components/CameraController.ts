import { Vector3 } from '../../mp/sdk';

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
  onChangeU: (u: number) => void, 
}

interface CameraControllerOutputs {
  camera: any,
}

class CameraController {

  private u: number = 0; // number in [0, 1] representing position along curve
  private length: number = 0; // length of curve
  private up: undefined | Vector3;
  private timeReference: number = Date.now(); // keep track of time and u when pausing/resuming
  private uReference: number = 0;

  private inputs: CameraControllerInputs = {
    curve: null, // THREE.Curve object
    speed: 1.5, // speed in meters per second
    verticalOffset: 1., // vertical offset from curve
    enabled: false, // true to move forward automatically, false to pause
    onChangeU: (u) => null, // callback eahc time u changes
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
  public setManualU(u: number) {
    const { position, rotation } = this.getPoseAt(u);
    this.setCamera(position, rotation);
    this.inputs.onChangeU(u);
    this.uReference = u;
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

  public onEvent = function(_type: any, _data: any) {
  };

  public onInputsUpdated = (_previous: any) => {
    const { enabled } = this.inputs;
    if (enabled) {
      this.timeReference = Date.now() // when resuming, update reference time
    } else {
      this.uReference = this.u; // when pausing, update reference u
    }
  };

  public onTick = async (_tickDelta: any) => {
    const { speed, enabled } = this.inputs;
    if (enabled) {
      const deltaTime = (Date.now() - this.timeReference)/1000;
      const u = Math.min(this.uReference + speed * deltaTime / this.length, 1); // clamp u less than 1
      const { position, rotation } = this.getPoseAt(u);
      this.setCamera(position, rotation);
      this.inputs.onChangeU(u);
      this.u = u;
    }
  };

  public onDestroy = function() {
  };
}

export const cameraControllerType = 'sdk-component.cameraController';
export function CameraControllerFactory() {
  return new CameraController();
}
