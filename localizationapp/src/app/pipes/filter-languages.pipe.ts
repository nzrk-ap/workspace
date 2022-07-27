import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterlanguages',
})
export class FilterLanguagesPipe implements PipeTransform {
  transform(items: string[], defaultLanguage: string): string[] {
    debugger;
    return items.filter((item) => item != defaultLanguage);
  }
}
