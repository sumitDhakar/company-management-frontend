import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeesDashboard } from 'src/app/entites/employees-dashboard';
import { Holidays } from 'src/app/entites/holidays';
import { Users } from 'src/app/entites/users';
import { ImageUtil } from 'src/app/payload/image-util';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeDashboardServiceService } from 'src/app/services/employee/employee-dashboard-service.service';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  constructor(private dashboardService: EmployeeDashboardServiceService
    , private authService: AuthService) {
          this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

     }

  dashBoard: EmployeesDashboard = new EmployeesDashboard();
  Hoildayes: Holidays = new Holidays();
  presentDate: Date = new Date();
  ngOnInit(): void {
    this.getDetails();
    this.setUserDetais();
    this.setBaseUrl();
    this.removeSidebarClass();
  }
  baseRoute = 'employee-dash'


  setBaseUrl() {
    this.baseRoute = this.authService.getUrl();
  }

  employee:Users=new  Users();
  imageUtils: ImageUtil = new ImageUtil();
  imageUrl = this.imageUtils.getImageUrl();
  getDetails() {
    this.dashboardService.getEmployeeDetails().subscribe((data: any) => {
      this.dashBoard = data;
      this.presentDate = new Date();
    });
  }



  setUserDetais(){
    this.employee= this.authService.getUser();
 }

 removeSidebarClass(){
  let element = document.getElementById("sidebar");
  element?.classList.add('opened');
  
}


}