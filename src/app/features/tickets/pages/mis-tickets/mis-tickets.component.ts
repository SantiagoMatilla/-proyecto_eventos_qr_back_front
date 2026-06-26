import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-mis-tickets',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './mis-tickets.component.html',
  styleUrls: ['./mis-tickets.component.scss'],
})
export class MisTicketsComponent {}
