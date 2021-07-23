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

  private timeReference: number = Date.now(); // keep track of time and u when pausing/resuming
  private uReference: number = 0;
  private u: number = 0;
  private length: number = 1;
  private up: undefined | Vector3;

  private inputs: CameraControllerInputs = {
    curve: null,
    speed: 1.,
    verticalOffset: 1.,
    enabled: false,
    onChangeU: (u) => null,
  };

  private outputs = {
    camera: null,
  } as CameraControllerOutputs;

  private context: any;

  private getPoseAt(u: number): {position: Vector3, rotation: Euler} {
    const { curve, speed, verticalOffset } = this.inputs;
    const THREE = this.context.three;

    // position
    const uPast = Math.max(u - speed / this.length, 0); // one second in past
    const uFuture = Math.min(u + speed / this.length, 1); // one second in the future
    const position = curve.getPointAt(u);
    position.y += verticalOffset; // add vertical offset;
    const positionPast = curve.getPointAt(uPast);
    const positionFuture = curve.getPointAt(uFuture);
    // rotation
    const matrix = new THREE.Matrix4().lookAt(positionPast, positionFuture, this.up);
    const rotation = new THREE.Euler().setFromRotationMatrix(matrix, "YXZ");
    return { position, rotation };
  }

  private setCamera(position: Vector3, rotation: Euler) {
    const { camera } = this.outputs;
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    camera.updateProjectionMatrix();
  }

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
      this.timeReference = Date.now()
    } else {
      this.uReference = this.u;
    }
  };

  public onTick = async (_tickDelta: any) => {
    const { speed, enabled } = this.inputs;
    if (enabled) {
      const deltaTime = (Date.now() - this.timeReference)/1000;
      const u = Math.min(this.uReference + speed * deltaTime / this.length, 1); // clamp u <= 1
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
