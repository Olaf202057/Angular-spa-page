import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from '../../message.service';
import { ScoreGridComponent } from '../score-grid/score-grid.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    currentRoute = 'Home';
    isLight = true;
    constructor(private router: Router, private messageService: MessageService, private elementRef: ElementRef) { }

    ngOnInit(): void {
        if (environment.theme == 'light') {
            this.isLight = true;
        } else {
            this.isLight = false;
        }
    }

    navigate(value, path) {
        this.currentRoute = value;
        this.router.navigateByUrl(path, { skipLocationChange: true });
    }

    changeTheme() {
        if (environment.theme == 'light') {
            environment.theme = 'dark';
            this.isLight = false;
            this.elementRef.nativeElement.ownerDocument.body.className = 'base-dark-background';
        } else {
            environment.theme = 'light';
            this.isLight = true;
            this.elementRef.nativeElement.ownerDocument.body.className = 'base-background';
        }

        this.messageService.doChangeTheme();

        if (this.isLightT()) {
            if (ScoreGridComponent.components[0].color == '#ffd000') {
                ScoreGridComponent.setColorFromHeader('#146853');
            }

        } else {
            if (ScoreGridComponent.components[0].color == '#146853') {
                ScoreGridComponent.setColorFromHeader('#ffd000')
            }
        }

    }

    isLightT() {
        return environment.theme == 'light';
    }

    isResponsive() {
        return environment.headerWidth == 'responsive'
    }

}
