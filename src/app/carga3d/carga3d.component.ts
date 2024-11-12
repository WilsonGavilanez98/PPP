import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-carga3d',
  templateUrl: './carga3d.component.html',
  styleUrl: './carga3d.component.css'
})
export class Carga3dComponent implements OnInit{

  selectedFile: File | null = null;
  selectedCountry: string = '';
  selectedGender: string = '';
  assets: string[] = []; // URLs de los assets existentes
  countries: string[] = []; // Lista de países obtenida dinámicamente
  genders: string[] = []; // Lista de géneros obtenida dinámicamente
  selectedAsset: string | null = null; // Asset seleccionado para mostrar en el área principal


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCountries(); // Carga la lista de países al iniciar
    this.loadAssets();
  }

  loadAssets(): void {
    // Aquí se debe cargar la lista de assets desde Firebase Storage
    // Suponiendo que `assets` se llena con URLs de assets

    if (this.assets.length > 0) {
      this.selectedAsset = this.assets[0]; // Seleccionar el primer asset por defecto
    }
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
    this.loadExistingAssets(); // Carga los assets cuando se selecciona un género
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile && this.selectedCountry && this.selectedGender) {
      this.authService.upload3DAsset(this.selectedFile, this.selectedCountry, this.selectedGender).subscribe(url => {
        console.log('Archivo disponible en:', url);
        this.loadExistingAssets(); // Recarga los assets después de subir uno nuevo
      });
    }
  }

  loadExistingAssets() {
    if (this.selectedCountry && this.selectedGender) {
      this.authService.get3DAssets(this.selectedCountry, this.selectedGender).subscribe(urls => {
        this.assets = urls; // Almacena las URLs de los assets existentes
      });
    }
  }

  // Función para actualizar el asset seleccionado
  onAssetsLoaded() {
    if (this.assets.length > 0) {
      this.selectedAsset = this.assets[0]; // Muestra el primer asset por defecto
    }
  }
}
