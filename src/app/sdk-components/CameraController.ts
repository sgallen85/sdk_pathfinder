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
  onTickCallback: (u: number) => void,
}

interface CameraControllerOutputs {
  camera: any,
  u: number,
}

class CameraController {

  private timeReference: number = Date.now(); // keep track of time and u when pausing/resuming
  private uOffset: number = 0;
  private length: number = 1;
  private up: undefined | Vector3;

  private inputs: CameraControllerInputs = {
    curve: null,
    speed: 1.,
    verticalOffset: 1.,
    enabled: false,
    onTickCallback: (u) => null,
  };

  private outputs = {
    camera: null,
    u: 0,
  } as CameraControllerOutputs;

  private context: any;

  private getPoseAt(u: number): {position: Vector3, rotation: Euler} {
    const { curve, speed, verticalOffset } = this.inputs;
    const THREE = this.context.three;

    // position
    const uLook = u + speed / this.length; // look at point one second in the future
    const position = curve.getPointAt(u);
    const positionLook = curve.getPointAt(uLook);

    // rotation
    const matrix = new THREE.Matrix4().lookAt(position, positionLook, this.up);
    const rotation = new THREE.Euler().setFromRotationMatrix(matrix, "YXZ");
    
    // add vertical offset
    position.y += verticalOffset;
    return { position, rotation };
  }

  private setCamera(position: Vector3, rotation: Euler) {
    const { camera } = this.outputs;

    camera.position.copy(position);
    camera.rotation.copy(rotation);
    camera.updateProjectionMatrix();
  }

  // --- IComponent methods ----------------------------------------------------

  public onInit = async () => {
    const { curve } = this.inputs;
    const THREE = this.context.three;

    const camera = new THREE.PerspectiveCamera( 45, 1.333, 1, 1000 );
    this.outputs.camera = camera;
    this.length = curve.getLength();
    this.up = new THREE.Vector3(0, 1, 0);
  };

  public onEvent = function(_type: any, _data: any) {
  };

  public onInputsUpdated = (_previous: any) => {
    const { enabled } = this.inputs;
    if (enabled) {
      this.timeReference = Date.now()
    } else {
      this.uOffset = this.outputs.u;
    }
  };

  public onTick = async (_tickDelta: any) => {

    const { speed, enabled, onTickCallback } = this.inputs;
    const THREE = this.context.three;

    if (enabled) {
      const time = (Date.now() - this.timeReference)/1000;
      const u = this.uOffset + speed * time / this.length;
      const { position, rotation } = this.getPoseAt(u);
      this.setCamera(position, rotation);
  
      onTickCallback(u);
      this.outputs.u = u;
    }

  };

  public onDestroy = function() {
  };
}

export const cameraControllerType = 'sdk-component.cameraController';
export function CameraControllerFactory() {
  return new CameraController();
}
