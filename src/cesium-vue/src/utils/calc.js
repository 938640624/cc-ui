export function useCalcTools (viewer) {
  return {
    getFlyToOptsOfCamera (targetCartesian3, height = 0) {
      const { heading, pitch } = viewer.camera;
      const position = Cesium.Cartesian3.clone(targetCartesian3);
      const offset = offsetFromHeadingPitchRange(heading, pitch, height * 2.0);
      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      Cesium.Matrix4.multiplyByPoint(transform, offset, position);
      return {
        destination: position,
        orientation: { heading, pitch },
      }
    }
  }
}

function offsetFromHeadingPitchRange (heading, pitch, range) {
  pitch = Cesium.Math.clamp(
    pitch,
    -Cesium.Math.PI_OVER_TWO,
    Cesium.Math.PI_OVER_TWO
  );
  heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

  var pitchQuat = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Y,
    -pitch
  );
  var headingQuat = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Z,
    -heading
  );
  var rotQuat = Cesium.Quaternion.multiply(
    headingQuat,
    pitchQuat,
    headingQuat
  );
  var rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

  var offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
  Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
  Cesium.Cartesian3.negate(offset, offset);
  Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
  return offset;
}
