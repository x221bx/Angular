import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation',
    imports: [CommonModule, RouterModule],
    templateUrl: './navigation.html',
    styleUrl: './navigation.css',
})
export class Navigation {
    menuOpen = false;

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

    closeMenu(): void {
        this.menuOpen = false;
    }
}
