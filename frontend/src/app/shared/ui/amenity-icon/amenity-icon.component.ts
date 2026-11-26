import { Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

const iconNames: Record<string, string> = {
  wifi: 'wifi', pool: 'waves', spa: 'flower-2', restaurant: 'utensils', snowflake: 'snowflake',
  coffee: 'coffee', car: 'car', flower: 'flower-2', dumbbell: 'dumbbell', briefcase: 'briefcase',
  waves: 'waves', landmark: 'landmark',
};

@Component({
  selector: 'app-amenity-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-angular [name]="iconName()" [size]="size()" aria-hidden="true" />`,
  host: { '[attr.aria-hidden]': 'true', 'style': 'display: inline-flex; align-items: center' },
})
export class AmenityIconComponent {
  readonly iconKey = input.required<string>();
  readonly size = input(18);
  readonly iconName = computed(() => iconNames[this.iconKey()] ?? 'check');
}
