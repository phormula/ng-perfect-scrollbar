import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
export class ForceNativeScrollDirective {
    constructor(renderer, el) {
        this.renderer = renderer;
        ['ps__child', 'ps__child--consume'].forEach((className) => {
            this.renderer.addClass(el?.nativeElement, className);
        });
    }
}
ForceNativeScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ForceNativeScrollDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ForceNativeScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.4", type: ForceNativeScrollDirective, selector: "[forceNativeScrolling]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ForceNativeScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[forceNativeScrolling]'
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmVjdC1zY3JvbGxiYXItZm9yY2UtbmF0aXZlLXNjcm9sbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wLXNjcm9sbGJhci9zcmMvbGliL3BlcmZlY3Qtc2Nyb2xsYmFyLWZvcmNlLW5hdGl2ZS1zY3JvbGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXlCLE1BQU0sZUFBZSxDQUFDOztBQUtqRSxNQUFNLE9BQU8sMEJBQTBCO0lBRXJDLFlBQW9CLFFBQW1CLEVBQUUsRUFBYztRQUFuQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3JDLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O3VIQU5VLDBCQUEwQjsyR0FBMUIsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBSHRDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtpQkFDbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZm9yY2VOYXRpdmVTY3JvbGxpbmddJ1xufSlcbmV4cG9ydCBjbGFzcyBGb3JjZU5hdGl2ZVNjcm9sbERpcmVjdGl2ZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBlbDogRWxlbWVudFJlZikge1xuICAgIFsncHNfX2NoaWxkJywgJ3BzX19jaGlsZC0tY29uc3VtZSddLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbD8ubmF0aXZlRWxlbWVudCwgY2xhc3NOYW1lKTtcbiAgICB9KTtcbiAgfVxufVxuIl19