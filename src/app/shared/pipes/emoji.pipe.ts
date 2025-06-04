// emoji.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'emoji', standalone: true })
export class EmojiPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(emoji: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(emoji);
  }
}
