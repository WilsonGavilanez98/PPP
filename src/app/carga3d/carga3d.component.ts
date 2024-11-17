import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-carga3d',
  templateUrl: './carga3d.component.html',
  styleUrl: './carga3d.component.css'
})
export class Carga3dComponent implements OnInit {
  selectedFile: File | null = null;
  selectedCountry: string = '';
  selectedGender: string = '';
  selectedPosition: string = ''; // Estado seleccionado para el archivo
  assets: string[] = []; // URLs de los assets existentes
  countries: string[] = []; // Lista de países obtenida dinámicamente
  genders: string[] = []; // Lista de géneros obtenida dinámicamente
  positions: { value: string, label: string }[] = [
    { value: 'reposo', label: 'Reposo' },
    { value: 'activo', label: 'Activo' },
    { value: 'derrota', label: 'Derrota' },
    { value: 'inactivo', label: 'Inactivo' }
  ]; // Opciones de estados para el archivo
  selectedAsset: string | null = null; // Asset seleccionado para mostrar en el área principal
  uploadProgress: number = 0; // Porcentaje de progreso
  isUploading: boolean = false;
  alertMessage: string | null = null; // Mensaje de la alerta
  alertClass: string = ''; // Clase CSS para el estilo de la alerta

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCountries(); // Carga la lista de países al iniciar
  }

  loadCountries() {
    this.authService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onCountryChange() {
    this.loadGenders(); // Carga la lista de géneros cuando se selecciona un país
    this.assets = []; // Limpia los assets anteriores
  }

  loadGenders() {
    if (this.selectedCountry) {
      this.authService.getGenders(this.selectedCountry).subscribe(genders => {
        this.genders = genders;
      });
    }
  }

  onGenderChange() {
    this.loadAssets(); // Carga los assets cuando se selecciona un género
  }

  loadAssets() {
    if (this.selectedCountry && this.selectedGender) {
      this.authService.get3DAssets(this.selectedCountry, this.selectedGender).subscribe(urls => {
        this.assets = urls; // Almacena las URLs de los assets existentes
        this.selectedAsset = this.assets.length > 0 ? this.assets[0] : null; // Selecciona el primer asset como predeterminado si existe
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile && this.selectedCountry && this.selectedGender && this.selectedPosition) {
      this.isUploading = true;
  
      this.authService.upload3DAsset(this.selectedFile, this.selectedCountry, this.selectedGender, this.selectedPosition)
        .subscribe({
          next: (event) => {
            if (event.type === 'progress') {
              this.uploadProgress = Math.round(event.value);
            } else if (event.type === 'response') {
              this.isUploading = false;
              this.uploadProgress = 0;
              this.showAlert('Archivo subido con éxito.', 'success');
              this.loadAssets(); // Recarga los assets
            }
          },
          error: (err) => {
            console.error('Error al subir el archivo:', err);
            this.isUploading = false;
            this.uploadProgress = 0;
            this.showAlert('Error al subir el archivo.', 'error');
          }
        });
    }
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  
    // Oculta la alerta después de 5 segundos
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }
  
  
}
