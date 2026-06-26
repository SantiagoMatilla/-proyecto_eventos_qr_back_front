import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-org',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-org.component.html',
  styleUrls: ['./dashboard-org.component.scss'],
})
export class DashboardOrgComponent {}
