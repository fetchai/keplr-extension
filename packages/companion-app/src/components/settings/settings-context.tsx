import { atom, useAtom } from 'jotai';

const settingsDrawerAtom = atom(false);
export function useSettingsDrawer() {
  const [isSettingsOpen, setSettingOpen] = useAtom(settingsDrawerAtom);
  const opeSettings = () => setSettingOpen(true);
  const closeSettings = () => setSettingOpen(false);
  return {
    isSettingsOpen,
    opeSettings,
    closeSettings,
  };
}
