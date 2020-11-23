import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "search",
  pure:false
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    if(attr && attr){
      return items.filter(item=>item.battleWith.toLowerCase().indexOf(attr.toLowerCase())!==-1)
    }
    return items;
  }
}

@NgModule({
  declarations: [SearchPipe],
  exports: [SearchPipe]
})
export class SearchPipeModule {}