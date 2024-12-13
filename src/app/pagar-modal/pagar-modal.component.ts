import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pagar-modal',
  templateUrl: './pagar-modal.component.html',
  styleUrls: ['./pagar-modal.component.css'],
})
export class PagarModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PagarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  isSidebarCollapsed = false;

  onSidebarCollapseChanged(isActive: boolean){
    this.isSidebarCollapsed = isActive;
   }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  confirmarPago(): void {
    console.log('Pago confirmado para:', this.data.name);
    this.dialogRef.close(true);
  }
}
