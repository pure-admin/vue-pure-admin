import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisabled]',
})
export class DisabledDirective {

  @Input('appDisabled') set disabledDirective(condition: boolean) {
    const action = condition ? 'enable' : 'disable';
    setTimeout(() => this.ngControl.control[action](), 0);
  }

  constructor(
    private ngControl: NgControl,
  ) {
  }

}
