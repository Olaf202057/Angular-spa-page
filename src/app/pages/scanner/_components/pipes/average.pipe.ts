import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "average"
})

export class AveragePipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    var sum =  items[attr].reduce((a, b) => a + b, 0);
    return Math.ceil(sum/items[attr].length);
  }
}

@NgModule({
  declarations: [AveragePipe],
  exports: [AveragePipe]
})
export class AveragePipeModule {}