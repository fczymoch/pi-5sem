import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'brDate',
  standalone: true
})
export class BrDatePipe implements PipeTransform {
  private datePipe = new DatePipe('pt-BR');

  transform(value: Date | string | number | null | undefined, format: string = 'dd/MM/yyyy HH:mm'): string | null {
    if (!value) return null;
    
    // Converte string ISO para Date se necessário
    if (typeof value === 'string') {
      value = new Date(value);
    }
    
    return this.datePipe.transform(value, format) || null;
  }
}
