import { atom } from 'jotai';

// Define the alert types structure
interface AlertTypes {
  alertSuccess: string;
  alertError: string;
  alertInfo: string;
}

// Initial state
const initialAlertTypes: AlertTypes = {
  alertSuccess: '',
  alertError: '',
  alertInfo: '',
};

export type AlertType = 'success' | 'error' | 'info';
export interface AltertObject {
  alertType: AlertType;
  msg: string;
}
// Atom to store alert state
export const alertAtom = atom<AlertTypes>(initialAlertTypes);

// Utility function to update a specific alert
export const setNotificationAtom = atom(
  null,
  (get, set, { alertType, msg }: AltertObject) => {
    const current = get(alertAtom);
    const newAlertTypes = { ...current };

    if (alertType === 'success') newAlertTypes.alertSuccess = msg;
    if (alertType === 'error') newAlertTypes.alertError = msg;
    if (alertType === 'info') newAlertTypes.alertInfo = msg;

    set(alertAtom, newAlertTypes);
  }
);

// Utility function to clear all alerts
export const removeNotificationAtom = atom(null, (get, set) => {
  set(alertAtom, {
    alertSuccess: '',
    alertError: '',
    alertInfo: '',
  });
});
