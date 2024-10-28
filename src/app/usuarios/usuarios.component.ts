import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  nombreFiltro = new FormControl<string | null>('');
  paisFiltro = new FormControl<string | null>('');
  apodoFiltro = new FormControl<string | null>('');

  usuarios: any[] = [];
  filteredUsuarios: any[] = [];

  nombreSuggestions: any[] = [];
  paisSuggestions: any[] = [];
  apodoSuggestions: any[] = [];

  showNombreList = false;
  showPaisList = false;
  showApodoList = false;

  TotalRegistros = 0;
  TotalHombres = 0;
  TotalMujeres = 0;

  isSidebarCollapsed = false;
  sliderValue = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe(data => {
      this.usuarios = data;
      this.filteredUsuarios = data;
      this.calculateSummary();
    });

    this.nombreFiltro.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.authService.getUsers())
    ).subscribe(data => {
      this.nombreSuggestions = this.filterSuggestions(data, this.nombreFiltro.value || '', 'name');
      this.showNombreList = !!this.nombreFiltro.value && this.nombreSuggestions.length > 0;
      this.applyFilters();
    });

    this.paisFiltro.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.authService.getUsers())
    ).subscribe(data => {
      this.paisSuggestions = this.filterSuggestions(data, this.paisFiltro.value || '', 'country');
      this.showPaisList = !!this.paisFiltro.value && this.paisSuggestions.length > 0;
      this.applyFilters();
    });

    this.apodoFiltro.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.authService.getUsers())
    ).subscribe(data => {
      this.apodoSuggestions = this.filterSuggestions(data, this.apodoFiltro.value || '', 'nickname');
      this.showApodoList = !!this.apodoFiltro.value && this.apodoSuggestions.length > 0;
      this.applyFilters();
    });
  }

  filterSuggestions(data: any[], filterValue: string, field: string): any[] {
    if (!filterValue) return [];
    return data.filter(item =>
      item[field]?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  applyFilters() {
    this.filteredUsuarios = this.usuarios.filter(user =>
      (this.nombreFiltro.value ? user.name.toLowerCase().includes(this.nombreFiltro.value!.toLowerCase()) : true) &&
      (this.paisFiltro.value ? user.country.toLowerCase().includes(this.paisFiltro.value!.toLowerCase()) : true) &&
      (this.apodoFiltro.value ? user.nickname.toLowerCase().includes(this.apodoFiltro.value!.toLowerCase()) : true)
    );
    this.calculateSummary();
  }

  calculateSummary() {
    this.TotalRegistros = this.filteredUsuarios.length;
    this.TotalHombres = this.filteredUsuarios.filter(user => user.sex?.toLowerCase() === 'masculino').length;
    this.TotalMujeres = this.filteredUsuarios.filter(user => user.sex?.toLowerCase() === 'femenino').length;
  }
  

  selectSuggestion(suggestion: any, type: string) {
    if (type === 'name') {
      this.nombreFiltro.setValue(suggestion.name);
      this.showNombreList = false;
    } else if (type === 'country') {
      this.paisFiltro.setValue(suggestion.country);
      this.showPaisList = false;
    } else if (type === 'nickname') {
      this.apodoFiltro.setValue(suggestion.nickname);
      this.showApodoList = false;
    }
    this.applyFilters();
  }

  onNombreInput() {
    this.showNombreList = !!this.nombreFiltro.value && this.nombreSuggestions.length > 0;
  }

  onPaisInput() {
    this.showPaisList = !!this.paisFiltro.value && this.paisSuggestions.length > 0;
  }

  onApodoInput() {
    this.showApodoList = !!this.apodoFiltro.value && this.apodoSuggestions.length > 0;
  }

  onSliderChange(event: any) {
    this.sliderValue = event.target.value;
  }

  onSidebarCollapseChanged(isActive: boolean) {
    this.isSidebarCollapsed = isActive;
  }
}
