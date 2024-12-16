import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'base64Image'
})
export class Base64ImagePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string): any {
    if (!value) return '';

    // Verificar si ya tiene el prefijo data:image
    const imagePrefix = value.startsWith('data:image') ? '' : 'data:image/jpeg;base64,';
    return this.sanitizer.bypassSecurityTrustUrl(imagePrefix + value);
  }
}
