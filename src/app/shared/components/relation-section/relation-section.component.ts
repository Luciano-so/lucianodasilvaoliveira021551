import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-relation-section',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './relation-section.component.html',
  styleUrls: ['./relation-section.component.scss'],
})
export class RelationSectionComponent {
  @Input() noticeText = '';
  @Input() noticeIcon = '';
  @Input() noticeTitle = '';
  @Input() isEditMode = false;
  @Input() entityId: number | undefined;
  @Input() linkTemplate: TemplateRef<any> | undefined;
}
