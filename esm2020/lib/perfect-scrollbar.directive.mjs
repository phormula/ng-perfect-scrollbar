import PerfectScrollbar from 'perfect-scrollbar';
import ResizeObserver from 'resize-observer-polyfill';
import { Subject, fromEvent } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Optional, Directive, Input, Output, EventEmitter } from '@angular/core';
import { Geometry, Position } from './perfect-scrollbar.interfaces';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfig, PerfectScrollbarEvents } from './perfect-scrollbar.interfaces';
import * as i0 from "@angular/core";
export class PerfectScrollbarDirective {
    constructor(zone, differs, elementRef, platformId, defaults) {
        this.zone = zone;
        this.differs = differs;
        this.elementRef = elementRef;
        this.platformId = platformId;
        this.defaults = defaults;
        this.instance = null;
        this.ro = null;
        this.timeout = null;
        this.animation = null;
        this.configDiff = null;
        this.ngDestroy = new Subject();
        this.disabled = false;
        this.psScrollY = new EventEmitter();
        this.psScrollX = new EventEmitter();
        this.psScrollUp = new EventEmitter();
        this.psScrollDown = new EventEmitter();
        this.psScrollLeft = new EventEmitter();
        this.psScrollRight = new EventEmitter();
        this.psYReachEnd = new EventEmitter();
        this.psYReachStart = new EventEmitter();
        this.psXReachEnd = new EventEmitter();
        this.psXReachStart = new EventEmitter();
    }
    ngOnInit() {
        if (!this.disabled && isPlatformBrowser(this.platformId)) {
            const config = new PerfectScrollbarConfig(this.defaults);
            config.assign(this.config); // Custom configuration
            this.zone.runOutsideAngular(() => {
                this.instance = new PerfectScrollbar(this.elementRef.nativeElement, config);
            });
            if (!this.configDiff) {
                this.configDiff = this.differs.find(this.config || {}).create();
                this.configDiff.diff(this.config || {});
            }
            this.zone.runOutsideAngular(() => {
                this.ro = new ResizeObserver(() => {
                    this.update();
                });
                if (this.elementRef.nativeElement.children[0]) {
                    this.ro.observe(this.elementRef.nativeElement.children[0]);
                }
                this.ro.observe(this.elementRef.nativeElement);
            });
            this.zone.runOutsideAngular(() => {
                PerfectScrollbarEvents.forEach((eventName) => {
                    const eventType = eventName.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
                    fromEvent(this.elementRef.nativeElement, eventType)
                        .pipe(auditTime(20), takeUntil(this.ngDestroy))
                        .subscribe((event) => {
                        this[eventName].emit(event);
                    });
                });
            });
        }
    }
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.complete();
            if (this.ro) {
                this.ro.disconnect();
            }
            if (this.timeout && typeof window !== 'undefined') {
                window.clearTimeout(this.timeout);
            }
            this.zone.runOutsideAngular(() => {
                if (this.instance) {
                    this.instance.destroy();
                }
            });
            this.instance = null;
        }
    }
    ngDoCheck() {
        if (!this.disabled && this.configDiff && isPlatformBrowser(this.platformId)) {
            const changes = this.configDiff.diff(this.config || {});
            if (changes) {
                this.ngOnDestroy();
                this.ngOnInit();
            }
        }
    }
    ngOnChanges(changes) {
        if (changes['disabled'] && !changes['disabled'].isFirstChange() && isPlatformBrowser(this.platformId)) {
            if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === true) {
                    this.ngOnDestroy();
                }
                else if (changes['disabled'].currentValue === false) {
                    this.ngOnInit();
                }
            }
        }
    }
    ps() {
        return this.instance;
    }
    update() {
        if (typeof window !== 'undefined') {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = window.setTimeout(() => {
                if (!this.disabled && this.configDiff) {
                    try {
                        this.zone.runOutsideAngular(() => {
                            if (this.instance) {
                                this.instance.update();
                            }
                        });
                    }
                    catch (error) {
                        // Update can be finished after destroy so catch errors
                    }
                }
            }, 0);
        }
    }
    geometry(prefix = 'scroll') {
        return new Geometry(this.elementRef.nativeElement[prefix + 'Left'], this.elementRef.nativeElement[prefix + 'Top'], this.elementRef.nativeElement[prefix + 'Width'], this.elementRef.nativeElement[prefix + 'Height']);
    }
    position(absolute = false) {
        if (!absolute && this.instance) {
            return new Position(this.instance.reach.x || 0, this.instance.reach.y || 0);
        }
        else {
            return new Position(this.elementRef.nativeElement.scrollLeft, this.elementRef.nativeElement.scrollTop);
        }
    }
    scrollable(direction = 'any') {
        const element = this.elementRef.nativeElement;
        if (direction === 'any') {
            return element.classList.contains('ps--active-x') ||
                element.classList.contains('ps--active-y');
        }
        else if (direction === 'both') {
            return element.classList.contains('ps--active-x') &&
                element.classList.contains('ps--active-y');
        }
        else {
            return element.classList.contains('ps--active-' + direction);
        }
    }
    scrollTo(x, y, speed) {
        if (!this.disabled) {
            if (y == null && speed == null) {
                this.animateScrolling('scrollTop', x, speed);
            }
            else {
                if (x != null) {
                    this.animateScrolling('scrollLeft', x, speed);
                }
                if (y != null) {
                    this.animateScrolling('scrollTop', y, speed);
                }
            }
        }
    }
    scrollToX(x, speed) {
        this.animateScrolling('scrollLeft', x, speed);
    }
    scrollToY(y, speed) {
        this.animateScrolling('scrollTop', y, speed);
    }
    scrollToTop(offset, speed) {
        this.animateScrolling('scrollTop', (offset || 0), speed);
    }
    scrollToLeft(offset, speed) {
        this.animateScrolling('scrollLeft', (offset || 0), speed);
    }
    scrollToRight(offset, speed) {
        const left = this.elementRef.nativeElement.scrollWidth -
            this.elementRef.nativeElement.clientWidth;
        this.animateScrolling('scrollLeft', left - (offset || 0), speed);
    }
    scrollToBottom(offset, speed) {
        const top = this.elementRef.nativeElement.scrollHeight -
            this.elementRef.nativeElement.clientHeight;
        this.animateScrolling('scrollTop', top - (offset || 0), speed);
    }
    scrollToElement(element, offset, speed) {
        if (typeof element === 'string') {
            element = this.elementRef.nativeElement.querySelector(element);
        }
        if (element) {
            const elementPos = element.getBoundingClientRect();
            const scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();
            if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
                const currentPos = this.elementRef.nativeElement['scrollLeft'];
                const position = elementPos.left - scrollerPos.left + currentPos;
                this.animateScrolling('scrollLeft', position + (offset || 0), speed);
            }
            if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
                const currentPos = this.elementRef.nativeElement['scrollTop'];
                const position = elementPos.top - scrollerPos.top + currentPos;
                this.animateScrolling('scrollTop', position + (offset || 0), speed);
            }
        }
    }
    animateScrolling(target, value, speed) {
        if (this.animation) {
            window.cancelAnimationFrame(this.animation);
            this.animation = null;
        }
        if (!speed || typeof window === 'undefined') {
            this.elementRef.nativeElement[target] = value;
        }
        else if (value !== this.elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;
            let oldTimestamp = performance.now();
            let oldValue = this.elementRef.nativeElement[target];
            const cosParameter = (oldValue - value) / 2;
            const step = (newTimestamp) => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));
                // Only continue animation if scroll position has not changed
                if (this.elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    }
                    else {
                        this.elementRef.nativeElement[target] = newValue;
                        // On a zoomed out page the resulting offset may differ
                        oldValue = this.elementRef.nativeElement[target];
                        oldTimestamp = newTimestamp;
                        this.animation = window.requestAnimationFrame(step);
                    }
                }
            };
            window.requestAnimationFrame(step);
        }
    }
}
PerfectScrollbarDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarDirective, deps: [{ token: i0.NgZone }, { token: i0.KeyValueDiffers }, { token: i0.ElementRef }, { token: PLATFORM_ID }, { token: PERFECT_SCROLLBAR_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
PerfectScrollbarDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.4", type: PerfectScrollbarDirective, selector: "[perfectScrollbar]", inputs: { disabled: "disabled", config: ["perfectScrollbar", "config"] }, outputs: { psScrollY: "psScrollY", psScrollX: "psScrollX", psScrollUp: "psScrollUp", psScrollDown: "psScrollDown", psScrollLeft: "psScrollLeft", psScrollRight: "psScrollRight", psYReachEnd: "psYReachEnd", psYReachStart: "psYReachStart", psXReachEnd: "psXReachEnd", psXReachStart: "psXReachStart" }, exportAs: ["ngxPerfectScrollbar"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: PerfectScrollbarDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[perfectScrollbar]',
                    exportAs: 'ngxPerfectScrollbar'
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.KeyValueDiffers }, { type: i0.ElementRef }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [PERFECT_SCROLLBAR_CONFIG]
                }] }]; }, propDecorators: { disabled: [{
                type: Input
            }], config: [{
                type: Input,
                args: ['perfectScrollbar']
            }], psScrollY: [{
                type: Output
            }], psScrollX: [{
                type: Output
            }], psScrollUp: [{
                type: Output
            }], psScrollDown: [{
                type: Output
            }], psScrollLeft: [{
                type: Output
            }], psScrollRight: [{
                type: Output
            }], psYReachEnd: [{
                type: Output
            }], psYReachStart: [{
                type: Output
            }], psXReachEnd: [{
                type: Output
            }], psXReachStart: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmVjdC1zY3JvbGxiYXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcC1zY3JvbGxiYXIvc3JjL2xpYi9wZXJmZWN0LXNjcm9sbGJhci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxnQkFBZ0IsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxPQUFPLGNBQWMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFVLE1BQU0sRUFBRSxRQUFRLEVBQWMsU0FBUyxFQUNmLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV4RSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRXBFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxzQkFBc0IsRUFDaEMsc0JBQXNCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFNeEYsTUFBTSxPQUFPLHlCQUF5QjtJQTZCcEMsWUFBb0IsSUFBWSxFQUFVLE9BQXdCLEVBQ3pELFVBQXNCLEVBQStCLFVBQWtCLEVBQ3hCLFFBQXlDO1FBRjdFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN6RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQStCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBaUM7UUE5QnpGLGFBQVEsR0FBNEIsSUFBSSxDQUFDO1FB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QUFXO3NCQUFwQixNQUFNO2dCQUNHLGFBQWE7c0JBQXRCLE1BQU07Z0JBQ0csV0FBVztzQkFBcEIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBlcmZlY3RTY3JvbGxiYXIgZnJvbSAncGVyZmVjdC1zY3JvbGxiYXInO1xuXG5pbXBvcnQgUmVzaXplT2JzZXJ2ZXIgZnJvbSAncmVzaXplLW9ic2VydmVyLXBvbHlmaWxsJztcblxuaW1wb3J0IHsgU3ViamVjdCwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBhdWRpdFRpbWUsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nWm9uZSwgSW5qZWN0LCBPcHRpb25hbCwgRWxlbWVudFJlZiwgRGlyZWN0aXZlLFxuICBPbkluaXQsIERvQ2hlY2ssIE9uQ2hhbmdlcywgT25EZXN0cm95LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsXG4gIFNpbXBsZUNoYW5nZXMsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgR2VvbWV0cnksIFBvc2l0aW9uIH0gZnJvbSAnLi9wZXJmZWN0LXNjcm9sbGJhci5pbnRlcmZhY2VzJztcblxuaW1wb3J0IHsgUEVSRkVDVF9TQ1JPTExCQVJfQ09ORklHLCBQZXJmZWN0U2Nyb2xsYmFyQ29uZmlnLCBQZXJmZWN0U2Nyb2xsYmFyQ29uZmlnSW50ZXJmYWNlLFxuICBQZXJmZWN0U2Nyb2xsYmFyRXZlbnQsIFBlcmZlY3RTY3JvbGxiYXJFdmVudHMgfSBmcm9tICcuL3BlcmZlY3Qtc2Nyb2xsYmFyLmludGVyZmFjZXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcGVyZmVjdFNjcm9sbGJhcl0nLFxuICBleHBvcnRBczogJ25neFBlcmZlY3RTY3JvbGxiYXInXG59KVxuZXhwb3J0IGNsYXNzIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBpbnN0YW5jZTogUGVyZmVjdFNjcm9sbGJhciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgcm86IFJlc2l6ZU9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSB0aW1lb3V0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBhbmltYXRpb246IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgY29uZmlnRGlmZjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZ0Rlc3Ryb3k6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCdwZXJmZWN0U2Nyb2xsYmFyJykgY29uZmlnPzogUGVyZmVjdFNjcm9sbGJhckNvbmZpZ0ludGVyZmFjZTtcblxuICBAT3V0cHV0KCkgcHNTY3JvbGxZOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHNTY3JvbGxYOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBwc1Njcm9sbFVwOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHNTY3JvbGxEb3duOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHNTY3JvbGxMZWZ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHNTY3JvbGxSaWdodDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgcHNZUmVhY2hFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBwc1lSZWFjaFN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHNYUmVhY2hFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBwc1hSZWFjaFN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgem9uZTogTmdab25lLCBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChQRVJGRUNUX1NDUk9MTEJBUl9DT05GSUcpIHByaXZhdGUgZGVmYXVsdHM6IFBlcmZlY3RTY3JvbGxiYXJDb25maWdJbnRlcmZhY2UpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyQ29uZmlnKHRoaXMuZGVmYXVsdHMpO1xuXG4gICAgICBjb25maWcuYXNzaWduKHRoaXMuY29uZmlnKTsgLy8gQ3VzdG9tIGNvbmZpZ3VyYXRpb25cblxuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBjb25maWcpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5jb25maWdEaWZmKSB7XG4gICAgICAgIHRoaXMuY29uZmlnRGlmZiA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMuY29uZmlnIHx8IHt9KS5jcmVhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbmZpZ0RpZmYuZGlmZih0aGlzLmNvbmZpZyB8fCB7fSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMucm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICAgIHRoaXMucm8ub2JzZXJ2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvLm9ic2VydmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIFBlcmZlY3RTY3JvbGxiYXJFdmVudHMuZm9yRWFjaCgoZXZlbnROYW1lOiBQZXJmZWN0U2Nyb2xsYmFyRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBldmVudFR5cGUgPSBldmVudE5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAoYykgPT4gYC0ke2MudG9Mb3dlckNhc2UoKX1gKTtcblxuICAgICAgICAgIGZyb21FdmVudDxFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGV2ZW50VHlwZSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBhdWRpdFRpbWUoMjApLFxuICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5uZ0Rlc3Ryb3kpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgdGhpc1tldmVudE5hbWVdLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMubmdEZXN0cm95Lm5leHQoKTtcbiAgICAgIHRoaXMubmdEZXN0cm95LmNvbXBsZXRlKCk7XG5cbiAgICAgIGlmICh0aGlzLnJvKSB7XG4gICAgICAgIHRoaXMucm8uZGlzY29ubmVjdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50aW1lb3V0ICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5jb25maWdEaWZmICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmNvbmZpZ0RpZmYuZGlmZih0aGlzLmNvbmZpZyB8fCB7fSk7XG5cbiAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcblxuICAgICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddICYmICFjaGFuZ2VzWydkaXNhYmxlZCddLmlzRmlyc3RDaGFuZ2UoKSAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ2Rpc2FibGVkJ10ucHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddLmN1cnJlbnRWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHMoKTogUGVyZmVjdFNjcm9sbGJhciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmNvbmZpZ0RpZmYpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgLy8gVXBkYXRlIGNhbiBiZSBmaW5pc2hlZCBhZnRlciBkZXN0cm95IHNvIGNhdGNoIGVycm9yc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdlb21ldHJ5KHByZWZpeDogc3RyaW5nID0gJ3Njcm9sbCcpOiBHZW9tZXRyeSB7XG4gICAgcmV0dXJuIG5ldyBHZW9tZXRyeShcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50W3ByZWZpeCArICdMZWZ0J10sXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFtwcmVmaXggKyAnVG9wJ10sXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFtwcmVmaXggKyAnV2lkdGgnXSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50W3ByZWZpeCArICdIZWlnaHQnXVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcG9zaXRpb24oYWJzb2x1dGU6IGJvb2xlYW4gPSBmYWxzZSk6IFBvc2l0aW9uIHtcbiAgICBpZiAoIWFic29sdXRlICYmIHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oXG4gICAgICAgIHRoaXMuaW5zdGFuY2UucmVhY2gueCB8fCAwLFxuICAgICAgICB0aGlzLmluc3RhbmNlLnJlYWNoLnkgfHwgMFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxhYmxlKGRpcmVjdGlvbjogc3RyaW5nID0gJ2FueScpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAnYW55Jykge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcy0tYWN0aXZlLXgnKSB8fFxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncHMtLWFjdGl2ZS15Jyk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdib3RoJykge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcy0tYWN0aXZlLXgnKSAmJlxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncHMtLWFjdGl2ZS15Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncHMtLWFjdGl2ZS0nICsgZGlyZWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsVG8oeDogbnVtYmVyLCB5PzogbnVtYmVyLCBzcGVlZD86IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgaWYgKHkgPT0gbnVsbCAmJiBzcGVlZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsVG9wJywgeCwgc3BlZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHggIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsTGVmdCcsIHgsIHNwZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh5ICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmFuaW1hdGVTY3JvbGxpbmcoJ3Njcm9sbFRvcCcsIHksIHNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb1goeDogbnVtYmVyLCBzcGVlZD86IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsTGVmdCcsIHgsIHNwZWVkKTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb1koeTogbnVtYmVyLCBzcGVlZD86IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsVG9wJywgeSwgc3BlZWQpO1xuICB9XG5cbiAgcHVibGljIHNjcm9sbFRvVG9wKG9mZnNldD86IG51bWJlciwgc3BlZWQ/OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmFuaW1hdGVTY3JvbGxpbmcoJ3Njcm9sbFRvcCcsIChvZmZzZXQgfHwgMCksIHNwZWVkKTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb0xlZnQob2Zmc2V0PzogbnVtYmVyLCBzcGVlZD86IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsTGVmdCcsIChvZmZzZXQgfHwgMCksIHNwZWVkKTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb1JpZ2h0KG9mZnNldD86IG51bWJlciwgc3BlZWQ/OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGggLVxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG5cbiAgICB0aGlzLmFuaW1hdGVTY3JvbGxpbmcoJ3Njcm9sbExlZnQnLCBsZWZ0IC0gKG9mZnNldCB8fCAwKSwgc3BlZWQpO1xuICB9XG5cbiAgcHVibGljIHNjcm9sbFRvQm90dG9tKG9mZnNldD86IG51bWJlciwgc3BlZWQ/OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB0b3AgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQgLVxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXG4gICAgdGhpcy5hbmltYXRlU2Nyb2xsaW5nKCdzY3JvbGxUb3AnLCB0b3AgLSAob2Zmc2V0IHx8IDApLCBzcGVlZCk7XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsVG9FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nLCBvZmZzZXQ/OiBudW1iZXIsIHNwZWVkPzogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRQb3MgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBjb25zdCBzY3JvbGxlclBvcyA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcy0tYWN0aXZlLXgnKSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UG9zID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbJ3Njcm9sbExlZnQnXTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRQb3MubGVmdCAtIHNjcm9sbGVyUG9zLmxlZnQgKyBjdXJyZW50UG9zO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsTGVmdCcsIHBvc2l0aW9uICsgKG9mZnNldCB8fCAwKSwgc3BlZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcy0tYWN0aXZlLXknKSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UG9zID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbJ3Njcm9sbFRvcCddO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudFBvcy50b3AgLSBzY3JvbGxlclBvcy50b3AgKyBjdXJyZW50UG9zO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0ZVNjcm9sbGluZygnc2Nyb2xsVG9wJywgcG9zaXRpb24gKyAob2Zmc2V0IHx8IDApLCBzcGVlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhbmltYXRlU2Nyb2xsaW5nKHRhcmdldDogc3RyaW5nLCB2YWx1ZTogbnVtYmVyLCBzcGVlZD86IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbikge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uKTtcblxuICAgICAgdGhpcy5hbmltYXRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICghc3BlZWQgfHwgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50W3RhcmdldF0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFt0YXJnZXRdKSB7XG4gICAgICBsZXQgbmV3VmFsdWUgPSAwO1xuICAgICAgbGV0IHNjcm9sbENvdW50ID0gMDtcblxuICAgICAgbGV0IG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbdGFyZ2V0XTtcblxuICAgICAgY29uc3QgY29zUGFyYW1ldGVyID0gKG9sZFZhbHVlIC0gdmFsdWUpIC8gMjtcblxuICAgICAgY29uc3Qgc3RlcCA9IChuZXdUaW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNwZWVkIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xuXG4gICAgICAgIG5ld1ZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSArIGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSk7XG5cbiAgICAgICAgLy8gT25seSBjb250aW51ZSBhbmltYXRpb24gaWYgc2Nyb2xsIHBvc2l0aW9uIGhhcyBub3QgY2hhbmdlZFxuICAgICAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbdGFyZ2V0XSA9PT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRlU2Nyb2xsaW5nKHRhcmdldCwgdmFsdWUsIDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFt0YXJnZXRdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIC8vIE9uIGEgem9vbWVkIG91dCBwYWdlIHRoZSByZXN1bHRpbmcgb2Zmc2V0IG1heSBkaWZmZXJcbiAgICAgICAgICAgIG9sZFZhbHVlID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbdGFyZ2V0XTtcblxuICAgICAgICAgICAgb2xkVGltZXN0YW1wID0gbmV3VGltZXN0YW1wO1xuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICAgIH1cbiAgfVxufVxuIl19