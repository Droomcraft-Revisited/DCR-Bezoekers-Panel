import {Vector3} from "../../../helpers/math/Vector3";
import {Interpolator, MAGIC_SCHEDULE_VALUES} from "../../../helpers/math/Interpolator";
import {util} from 'util';

let playerMovementInterpolator = new Interpolator();

export function handlePlayerLocation(openAudioMc, data) {
    const x = data.x;
    const y = data.y;
    const z = data.z;
    const pitch = data.pitch;
    const yaw = data.yaw;

    playerMovementInterpolator.onMove = (l, p, y) => {
        console.log('[DCR] handlePlayerLocation.js = ' + JSON.stringify(openAudioMc, null, 4))
        openAudioMc.world.player.updateLocation(l, p, y)
    }
    playerMovementInterpolator.interpolate(new Vector3(x, y, z), pitch, yaw, MAGIC_SCHEDULE_VALUES.SELF_LOCATION_UPDATES);
}