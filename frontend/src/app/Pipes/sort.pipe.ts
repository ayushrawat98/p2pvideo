import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe<t> implements PipeTransform {

  transform(value: t[], sortAllowed : boolean, latestFirst : boolean): t[] {
    if(sortAllowed){
      if(latestFirst){
        return value && value.sort((a : any, b : any) => {
          if(a.createdAt && b.createdAt && new Date(a.createdAt) < new Date(b.createdAt)){
            return 1
          }else{
            return -1
          }
        })
      }else{
        return value && value.sort((a : any, b : any) => {
          if(a.createdAt && b.createdAt && new Date(a.createdAt) < new Date(b.createdAt)){
            return -1
          }else{
            return 1
          }
        })
      }
    }else{
      return value;
    }
  }

}
