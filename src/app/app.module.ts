import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccesoRComponent } from './acceso-r/acceso-r.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { BalanceComponent } from './balance/balance.component';
import { UsuarioNuevoComponent } from './usuario-nuevo/usuario-nuevo.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';





const firebaseConfig = {
  apiKey: "AIzaSyCb_YQUzVl_YYwAt7DKmtqNmT6HL3pe71c",
  authDomain: "moneycup-d4ee8.firebaseapp.com",
  projectId: "moneycup-d4ee8",
  storageBucket: "moneycup-d4ee8.appspot.com",
  messagingSenderId: "475047574738",
  appId: "1:475047574738:web:0f992030e63bdc506a410b",
  measurementId: "G-HH452HE2ZV"
  // Nota: locationId se ha eliminado
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    AccesoRComponent,
    UsuariosComponent,
    AnalyticsComponent,
    FinanzasComponent,
    BalanceComponent,
    UsuarioNuevoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatSlideToggleModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
