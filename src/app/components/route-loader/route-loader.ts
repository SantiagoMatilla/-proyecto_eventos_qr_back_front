import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  Router,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-route-loader',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './route-loader.html',
  styleUrl: './route-loader.scss',
})
export class RouteLoaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private subscripcion?: Subscription;

  cargando = signal(false);

  ngOnInit(): void {
    this.subscripcion = this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationStart) {
        this.cargando.set(true);
      } else if (
        evento instanceof NavigationEnd ||
        evento instanceof NavigationCancel ||
        evento instanceof NavigationError
      ) {
        this.cargando.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }
}
