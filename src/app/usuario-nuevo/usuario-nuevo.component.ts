import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrl: './usuario-nuevo.component.css'
})

  export class UsuarioNuevoComponent {
    userData = {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    };
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;
  
    constructor(private authService: AuthService, private router: Router) {}
  
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        this.selectedFile = input.files[0];
  
        // Mostrar previsualización de la imagen
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  
    async onSubmit(): Promise<void> {
      if (this.userData.password !== this.userData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
  
      try {
        await this.authService.registerUser(
          this.userData.email,
          this.userData.password,
          this.userData.displayName,
          this.selectedFile
        );
  
        alert("Usuario creado con éxito");
        this.router.navigate(['/login']);  // Redirigir al login o donde desees
      } catch (error) {
        console.error("Error al crear usuario:", error);
      }
    }

    togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
    }
  
    toggleConfirmPasswordVisibility(): void {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

