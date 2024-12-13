import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin: FormGroup;

  constructor(private router: Router,private authService: AuthService,private snackBar: MatSnackBar ){
    this.formLogin = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required])
    });
  }

  togglePassworVisibility(){
    const passwordField: any = document.getElementById('password');
    const toggleIcon: any = document.getElementById('togglePassword');
    if(passwordField.type == 'password'){
      passwordField.type = 'text';
      toggleIcon.classList.remove('fa-eye');
      toggleIcon.classList.add('fa-eye-slash');
    }else{
      passwordField.type = 'password';
      toggleIcon.classList.remove('fa-eye-slash');
      toggleIcon.classList.add('fa-eye')
    }
  }


  async onLogin() {
    const { email, password } = this.formLogin.value;

    try {
      const result = await this.authService.loginAndCheckFirestore(email, password);

      if (result.authorized) {
        this.router.navigate(['acceso-r']); // Redirige si todo está bien

        // Muestra el mensaje de éxito con el snackBar
        this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
          duration: 3000, // Duración en milisegundos (3 segundos)
          horizontalPosition: 'center', // Posición horizontal
          verticalPosition: 'top', // Posición vertical
          panelClass: ['snackbar-success'], // Clase CSS personalizada (opcional)
        });
      }

    } catch (error) {
      if (error instanceof Error) {
        alert('Contraseña o correo incorrecto');
      } else {
        alert('Ha ocurrido un error desconocido');
      }
    }
  }
}
