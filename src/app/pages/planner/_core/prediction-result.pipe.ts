import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'predictionResult',
})
export class PredictionResultPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let result = '';
    const market = args[0].market;

    switch (market) {
      case 'Result':
      case 'Double Chance':
        result = `${value[0]} result will be ${value[1]}`;
        break;
      case 'Total Goals':
        result = `${value[0]} ${value[1]} in ${value[2]} for ${value[3]}`;
        break;
      case 'Corners':
        result = `${value[0]} ${value[1]} in ${value[2]} for ${value[3]}`;
        break;
      case 'Both Teams on Score':
        result = `Both Teams ${
          value[1] === 'Yes' ? 'will' : 'will not'
        } score in the ${value[0]}`;
        break;
      case 'Half Time/Full Time':
        result = `${value[0]} result will be ${value[1]}`;
        break;
      case 'Score':
        result = `${value[0]} will be ${value[1]}`;
        break;
      case 'Half with Most Goals':
        result = `Most Goals to be Scored in ${value[0]}`;
        break;
      case 'Yellow Cards':
        result = `${value[0]} ${value[1].split(' ')[0]} Yellow Cards in ${
          value[2]
        } for ${value[3]}`;
        break;
      case 'Red Cards':
        result = `${value[0]} ${value[1].split(' ')[0]} Red Cards in ${
          value[2]
        } for ${value[3]}`;
        break;
      case 'Goal Times':
        result = `${value[0]} during ${value[1]}`;
        break;
      case 'Red Cards':
        result = `${value[0]} ${value[1].split(' ')[0]} Red Cards in ${
          value[2]
        } for ${value[3]}`;
        break;
      case 'Total Cards':
      case 'Free Kicks':
      case 'Throw Ins':
      case 'Goal Kicks':
        result = `${value[0]} ${value[1]} in ${value[2]} for ${value[3]}`;
        break;
      case 'Winning Margin':
        result = `${value[0]} to win the ${value[1]} by ${value[2]}`;
        break;
      default:
        result = '';
        break;
    }

    return result;
  }
}
