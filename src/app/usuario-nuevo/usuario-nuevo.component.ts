import { Component } from '@angular/core';
import { UserService } from '../auth.service';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrl: './usuario-nuevo.component.css'
})

export class UsuarioNuevoComponent {
  email: string;
  password: string;
  usuario: string;
  fotoURL: string;  // URL o archivo de la foto

  constructor(private userService: UserService) {
    this.email = ''; // Asigna un valor inicial en el constructor
    this.password = '';
    this.usuario = '';
    this.fotoURL = '';
  }

  async crearUsuario() {
    try {
      // Registro del usuario en Firebase Authentication
      const user = await this.userService.registerUser(this.email, this.password);

      if (user) {
        // Datos adicionales del usuario a guardar en Firestore
        const userData = {
          nombre: this.usuario,
          email: this.email,
          password: this.password
        };

        // Guardar los datos del usuario y la foto en Firestore
        await this.userService.saveUserProfile(user.uid, userData, this.fotoURL);
        console.log('Usuario creado y datos guardados correctamente.');
      }
    } catch (error) {
      console.error('Error al crear usuario o guardar sus datos', error);
    }
  }
}
