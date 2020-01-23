import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
    public forecasts: WeatherForecast[];
    public externalData: string;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
      http.get<WeatherForecast[]>(baseUrl + 'weatherforecast').subscribe(result => {
          this.forecasts = result;
      }, error => console.error(error));

      this.getExternalData(http, baseUrl);
  }

    getExternalData(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        http.get<string>(baseUrl + 'external-api').subscribe(result => {
            this.externalData = result;
        }, error => {
                this.externalData = error.message;
                console.error(error);
        });
    }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
