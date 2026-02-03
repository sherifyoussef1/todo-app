import { Pipe, PipeTransform } from '@angular/core';
import { ITodo } from '../Models/ITodo';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: ITodo[], field: string, value: any): ITodo[] {
    if (!items || !field) {
      return items;
    }
    return items.filter((item) => item[field as keyof ITodo] === value);
  }
}
