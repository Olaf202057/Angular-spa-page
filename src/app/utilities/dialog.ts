import { MatDialogConfig } from '@angular/material/dialog';

export function getDialogConfig({
  width,
  data = {},
  autoFocus = false,
  disableClose = false,
}): MatDialogConfig {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = width;
  dialogConfig.data = data;
  dialogConfig.autoFocus = autoFocus;
  dialogConfig.disableClose = disableClose;
  return dialogConfig;
}
