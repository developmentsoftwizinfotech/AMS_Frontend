// angular import
import { Component } from '@angular/core';
import { Tables } from 'src/app/core/base/models/base-resource';
import { NotificationComponent } from 'src/app/core/services/notification/component/notification/notification.component';
import { CardComponent } from 'src/app/shared/modules/card/card.component';

// project import

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CardComponent, NotificationComponent],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
})
export default class SamplePageComponent {
  tableName:any;
  // sessionKey: string = this.tableName;
}
