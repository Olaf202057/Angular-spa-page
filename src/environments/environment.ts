// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'api',
  // apiUrl: 'https://scannerapi.azurewebsites.net/api',
  fullGridLoad:true,
  gridLoadBeforeDays:17,
  serverUrl: 'https://scannerapi.azurewebsites.net',
  allPlayUrl:'/api/inplay',
  getPrediction: '/api/predictionsmanager',
  historicalMatchUrl:'/api/HistoricalMatches',
  strategyUrl:'/api/strategies',
  theme:'light',
  headerWidth:'full'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
