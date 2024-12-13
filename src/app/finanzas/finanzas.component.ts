import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PagarModalComponent } from '../pagar-modal/pagar-modal.component';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


@Component({

  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrl: './finanzas.component.css'
})
export class FinanzasComponent  implements AfterViewInit, OnDestroy{
  private chartMontoPagar: am5.Root | undefined;
  private chartMontoGeneral: am5.Root | undefined;
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];

  // Datos dinámicos
  montoPagado = 400;
  montoPendiente = 600;
  totalMonto = 1000;

  constructor (private authService: AuthService, private dialog: MatDialog){}

  isSidebarCollapsed = false;

  onSidebarCollapseChanged(isActive: boolean){
    this.isSidebarCollapsed = isActive;
   }

   ngOnInit(): void {
    this.authService.getUsers().subscribe(data => {
      this.usuarios = data;
      this.filteredUsuarios = data;
    });}

    ngAfterViewInit(): void {
      this.initChartMontoPagar();
      this.initChartMontoGeneral();
    }
        
    abrirModal(usuario: any): void {
      const dialogRef = this.dialog.open(PagarModalComponent, {
        width: '400px',
        data: usuario
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Pago realizado para:', usuario.name);
          // Marca al usuario como pagado
          usuario.pagado = true;
    
          // Opcional: Filtra usuarios ya pagados
          this.filteredUsuarios = this.usuarios.filter(u => !u.pagado);
        }
      });
    }

    // Inicializa el gráfico de "Monto a Pagar"
  initChartMontoPagar() {
    const root = am5.Root.new("chartMontoPagar");
    root.setThemes([am5themes_Animated.default.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {})
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );

    // Datos dinámicos
    series.data.setAll([
      { category: "Pagado", value: this.montoPagado },
      { category: "Pendiente", value: this.montoPendiente }
    ]);

    // Mostrar porcentaje dentro de las slices
    series.slices.template.set("tooltipText", "{category}: {value} ({valuePercent.formatNumber('0.0')}%)");

    series.labels.template.setAll({
      text: "{valuePercent.formatNumber('0.0')}%",
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      textAlign: "center",
      textType: "circular"
    });

    // Agregar leyendas
    chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(90)
      })
    ).data.setAll(series.dataItems);

    this.chartMontoPagar = root;
  }

  // Inicializa el gráfico de "Monto General"
  initChartMontoGeneral() {
    const root = am5.Root.new("chartMontoGeneral");
    root.setThemes([am5themes_Animated.default.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {})
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );

    // Datos dinámicos
    series.data.setAll([
      { category: "Total", value: this.totalMonto },
      { category: "Gastado", value: this.montoPagado }
    ]);

    // Mostrar porcentaje dentro de las slices
    series.slices.template.set("tooltipText", "{category}: {value} ({valuePercent.formatNumber('0.0')}%)");

    series.labels.template.setAll({
      text: "{valuePercent.formatNumber('0.0')}%",
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      textAlign: "center",
      textType: "circular"
    });

    // Agregar leyendas
    chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(90)
      })
    ).data.setAll(series.dataItems);

    this.chartMontoGeneral = root;
  }
  
    ngOnDestroy() {
      this.chartMontoPagar?.dispose();
      this.chartMontoGeneral?.dispose();
    }
  }
