import { Directive,TemplateRef,ViewContainerRef,Input } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  constructor(private authService: AuthService, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }

  @Input() 
  
  set appHasPermission(permission: string) {

    this.viewContainer.clear();

    if (this.authService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } 
    else {
      this.viewContainer.clear();
    }
  }

}
