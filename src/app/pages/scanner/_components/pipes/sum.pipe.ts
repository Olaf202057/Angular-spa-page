import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sum"
})
export class SumValuePipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    return items[attr].reduce((a, b) => a + b, 0);
  }
}

@NgModule({
  declarations: [SumValuePipe],
  exports: [SumValuePipe]
})
export class SumPipeModule {}