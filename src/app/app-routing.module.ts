import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AccesoRComponent } from './acceso-r/acceso-r.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { UsuarioNuevoComponent } from './usuario-nuevo/usuario-nuevo.component';
import { BalanceComponent } from './balance/balance.component';
import { Carga3dComponent } from './carga3d/carga3d.component';


const routes: Routes = [
    {path: '',redirectTo:'/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'menu', component: MenuComponent},
    {path: 'usuarios', component: UsuariosComponent},
    {path: 'acceso-r', component: AccesoRComponent},
    {path: 'analytics', component: AnalyticsComponent},
    {path: 'balance', component: BalanceComponent},
    {path: 'finanzas', component: FinanzasComponent},
    {path: 'usuario-nuevo', component: UsuarioNuevoComponent},
    {path: 'carga3d', component: Carga3dComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

