import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { ForceNativeScrollDirective } from './perfect-scrollbar-force-native-scroll.directive';
import * as i0 from "@angular/core";
export class PerfectScrollbarModule {
}
PerfectScrollbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PerfectScrollbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarModule, declarations: [PerfectScrollbarComponent,
        PerfectScrollbarDirective,
        ForceNativeScrollDirective], imports: [CommonModule], exports: [CommonModule,
        PerfectScrollbarComponent,
        PerfectScrollbarDirective,
        ForceNativeScrollDirective] });
PerfectScrollbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarModule, imports: [CommonModule, CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [
                        PerfectScrollbarComponent,
                        PerfectScrollbarDirective,
                        ForceNativeScrollDirective,
                    ],
                    exports: [
                        CommonModule,
                        PerfectScrollbarComponent,
                        PerfectScrollbarDirective,
                        ForceNativeScrollDirective,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmVjdC1zY3JvbGxiYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcC1zY3JvbGxiYXIvc3JjL2xpYi9wZXJmZWN0LXNjcm9sbGJhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sbURBQW1ELENBQUM7O0FBZ0IvRixNQUFNLE9BQU8sc0JBQXNCOzttSEFBdEIsc0JBQXNCO29IQUF0QixzQkFBc0IsaUJBWC9CLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsMEJBQTBCLGFBSmxCLFlBQVksYUFPcEIsWUFBWTtRQUNaLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsMEJBQTBCO29IQUdqQixzQkFBc0IsWUFidkIsWUFBWSxFQU9wQixZQUFZOzJGQU1ILHNCQUFzQjtrQkFkbEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRTt3QkFDWix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMEJBQTBCO3FCQUMzQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMEJBQTBCO3FCQUMzQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBQZXJmZWN0U2Nyb2xsYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9wZXJmZWN0LXNjcm9sbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZSB9IGZyb20gJy4vcGVyZmVjdC1zY3JvbGxiYXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZvcmNlTmF0aXZlU2Nyb2xsRGlyZWN0aXZlIH0gZnJvbSAnLi9wZXJmZWN0LXNjcm9sbGJhci1mb3JjZS1uYXRpdmUtc2Nyb2xsLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBQZXJmZWN0U2Nyb2xsYmFyQ29tcG9uZW50LFxuICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUsXG4gICAgRm9yY2VOYXRpdmVTY3JvbGxEaXJlY3RpdmUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgUGVyZmVjdFNjcm9sbGJhckNvbXBvbmVudCxcbiAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLFxuICAgIEZvcmNlTmF0aXZlU2Nyb2xsRGlyZWN0aXZlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBQZXJmZWN0U2Nyb2xsYmFyTW9kdWxlIHt9XG4iXX0=