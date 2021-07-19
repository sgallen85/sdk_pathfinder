import { Color, Vector3 } from "../../mp/sdk";

interface PathRendererInputs {
  visible: boolean;
  path: Vector3[];
  radius: number;
  color: Color | number;
  opacity: number;
  heightOffset: number;
  stepMultiplier: number;
}

class PathRenderer {

  private material: any;

  private inputs: PathRendererInputs = {
    visible: false,
    path: [], // positions on path
    radius: 0.15,
    color: 0x00ff00,
    opacity: 0.5,
    heightOffset: -1,
    stepMultiplier: 5,
  };

  private context: any;

  private outputs: any;

  public onInit = async () => {

    const THREE = this.context.three;

    const { path,
            radius,
            heightOffset,
            opacity,
            color,
            stepMultiplier } = this.inputs;

    // check if path is long enough and no undefined points
    if (path.length < 2 || !path.every(p => !!p)) return;
    
    const points = path.map(p => new THREE.Vector3(p.x, p.y+heightOffset, p.z));
    const spline = new THREE.CatmullRomCurve3(points);

    const extrudeSettings = {
        steps: stepMultiplier * path.length,
        bevelEnabled: false,
        extrudePath: spline,
    };

    // Shape to extrude
    const arcShape = new THREE.Shape().absarc(0, 0, radius, 0, Math.PI * 2, false);
    
    const extrudeGeometry = new THREE.ExtrudeGeometry( arcShape, extrudeSettings );
    
    this.material = new THREE.MeshBasicMaterial({
        color: color as number,
        transparent: true,
        opacity: opacity,
    });

    const pathMesh = new THREE.Mesh(extrudeGeometry, this.material)

    this.outputs.objectRoot = pathMesh;
  };

  public onEvent = function(_type: any, _data: any) {
  }

  public onInputsUpdated = function(_previous: any) {
  };

  public onTick = function(_tickDelta: any) {
  };

  public onDestroy = () => {
    this.material?.dispose();
  };
}

export const pathRendererType = 'sdk-component.pathRenderer';
export function PathRendererFactory() {
  return new PathRenderer();
}