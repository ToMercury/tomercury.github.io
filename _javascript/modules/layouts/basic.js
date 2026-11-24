import { back2top, loadTooltip, modeWatcher } from '../components';
import { initPet } from '../components/pet';

export function basic() {
  modeWatcher();
  back2top();
  loadTooltip();
  initPet();
}
