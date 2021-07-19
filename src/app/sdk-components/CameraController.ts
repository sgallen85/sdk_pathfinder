interface CameraControllerInputs {
  curve: any,
  speed: number,
  verticalOffset: number
}

interface CameraControllerOutputs {
  camera: any,
}

class CameraController {

  private startTime: any;
  private length: any;
  private up: any;

  private inputs: CameraControllerInputs = {
    curve: null,
    speed: 1.,
    verticalOffset: 1.,
  };

  private context: any;

  private outputs = {
    camera: null,
  } as CameraControllerOutputs;

  public onInit = async () => {
    const THREE = this.context.three;
    console.log("start");

    const camera = new THREE.PerspectiveCamera( 45, 1.333, 1, 1000 );
    this.outputs.camera = camera;
    
    camera.position.copy(this.inputs.curve.getPoint(0));
    camera.position.y += this.inputs.verticalOffset;
    camera.updateProjectionMatrix();

    this.startTime = Date.now();
    this.length = this.inputs.curve.getLength();
    this.up = new THREE.Vector3(0, 1, 0);

  };

  public onEvent = function(_type: any, _data: any) {
  };

  public onInputsUpdated = function(_previous: any) {
  };

  public onTick = async (_tickDelta: any) => {
    const THREE = this.context.three;

    const time = (Date.now() - this.startTime)/1000;
    const tNow = this.inputs.speed * time / this.length;
    const tFuture = this.inputs.speed * (time + 1) / this.length;

    // positions
    const currPos = this.inputs.curve.getPointAt(tNow);
    const futurePos = this.inputs.curve.getPointAt(tFuture);
    this.outputs.camera.position.copy(currPos);
    this.outputs.camera.position.y += 1.;

    // rotation
    const matrix = new THREE.Matrix4().lookAt(currPos, futurePos, this.up);
    const quaternion = new this.context.three.Quaternion().setFromRotationMatrix(matrix);
    this.outputs.camera.quaternion.copy(quaternion);
    this.outputs.camera.updateProjectionMatrix();
  };

  public onDestroy = function() {
  };
}

export const cameraControllerType = 'sdk-component.cameraController';
export function CameraControllerFactory() {
  return new CameraController();
}
