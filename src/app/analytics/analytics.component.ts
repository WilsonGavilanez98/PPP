import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { isPlatformBrowser } from '@angular/common';
import * as am5xy from '@amcharts/amcharts5/xy';
import { AuthService } from '../auth.service';
import { countryCodeMap } from '../countrycode';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements AfterViewInit {
  rootMap: am5.Root | undefined;
  rootBar: am5.Root | undefined;
  countryCodeMap = countryCodeMap;

  users: any[] = []; // Para almacenar los usuarios
  barData = [
    { country: 'United States', users: 120 },
    { country: 'Canada', users: 80 },
    { country: 'Mexico', users: 60 },
    { country: 'France', users: 100 },
    { country: 'Japan', users: 70 },
    { country: 'Ecuador', users: 150 },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Obtener usuarios desde Firestore
      this.authService.getUsers().subscribe((users) => {
        this.users = users.map((user) => ({
          name: user.name,
          countryCode: this.countryCodeMap[user.country] || user.country, // Mapea el país a su código
        }));

        const countryCodes = this.users.map((user) => user.countryCode);
        this.createMap(countryCodes);
        this.createBarChart();
      });
    }
  }

  createMap(countryCodes: string[]) {
    this.rootMap = am5.Root.new('chartdiv');
    let chart = this.rootMap.container.children.push(
      am5map.MapChart.new(this.rootMap, {
        projection: am5map.geoMercator(),
      })
    );

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(this.rootMap, {
        geoJSON: am5geodata_worldLow,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: '{name}',
      interactive: true,
      fill: am5.color(0xa9a9a9),
    });

    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x677e52),
    });

    polygonSeries.data.setAll(am5geodata_worldLow.features);

    this.highlightCountries(polygonSeries, this.users);
  }

  highlightCountries(series: any, users: any[]) {
    const validUsers = users.filter((user) => user.countryCode);

    const userCountByCountry = validUsers.reduce((acc, user) => {
      acc[user.countryCode] = (acc[user.countryCode] || 0) + 1;
      return acc;
    }, {});

    console.log(
      'Conteo de usuarios por país:',
      JSON.stringify(userCountByCountry, null, 2)
    );

    series.mapPolygons.each((polygon: any) => {
      const countryId = polygon.dataItem.dataContext.id;
      const userCount = userCountByCountry[countryId] || 0;

      if (userCount > 5) {
        polygon.set('fill', am5.color(0x677e52));
      } else {
        polygon.set('fill', am5.color(0xa9a9a9));
      }

      polygon.set('tooltipText', `${countryId}: ${userCount} usuarios`);
    });
  }

  createBarChart() {
    this.rootBar = am5.Root.new('barchartdiv');

    let chart = this.rootBar.container.children.push(
      am5xy.XYChart.new(this.rootBar, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: this.rootBar.verticalLayout,
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.rootBar, {
        categoryField: 'country',
        renderer: am5xy.AxisRendererX.new(this.rootBar, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootBar, {
        renderer: am5xy.AxisRendererY.new(this.rootBar, {}),
      })
    );

    xAxis.data.setAll(this.barData);

    let series = chart.series.push(
      am5xy.ColumnSeries.new(this.rootBar, {
        name: 'Users',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'users',
        categoryXField: 'country',
      })
    );

    series.data.setAll(this.barData);

    series.appear(1000);
    chart.appear(1000, 100);
  }

  ngOnDestroy() {
    if (this.rootMap) {
      this.rootMap.dispose();
    }
    if (this.rootBar) {
      this.rootBar.dispose();
    }
  }

  isSidebarCollapsed = false;
  onSidebarCollapseChanged(isActive: boolean) {
    this.isSidebarCollapsed = isActive;
  }
}
