import { AuthServiceService } from './../auth-service.service';
import { LoaderService } from './../services/loader.service';
import { environment } from './../../environments/environment';
import { EventsService } from './events.service';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { map } from 'rxjs/operators';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  eventTypes: any;
  eventsData: any;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  activeDayIsOpen = true;

  refresh: Subject<any> = new Subject();

  events$: Observable<Array<CalendarEvent<any>>>;

  constructor(private modal: NgbModal,
    private eventsService: EventsService,
    private loaderService: LoaderService,
    private authService: AuthServiceService) { }

  ngOnInit() {
    // this.userID =  this.authService.decodeJwtToken()['uid'];
    const eventsTypeApiUrl = environment.apidocs + 'v2/API/Events/GetEventTypes';
    this.eventsService.getApi(eventsTypeApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.eventTypes = data['Data'];
      },
      error => {
        this.loaderService.display(false);
        console.log('events type error', error);
      });

    const eventsApiUrl = environment.apidocs + 'v2/API/Events/GetEvents?pageSize=50&pageOffset=0&sortField=EventName';
    this.events$ = this.eventsService.getApi(eventsApiUrl).pipe(
      map(res => {
        return res['Data']['Records'].map((item: any, index) => {
          return {
            id: item.EventID,
            start: new Date(item.EventStartDate),
            end: new Date(item.EventEndDate),
            title: item.EventName,
            color: this.isEven(index) ? colors.yellow : colors.blue,
            allDay: true,
            meta: item
          };
        });
      })
    );

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  getEventTypeData(eventTypeId: any) {
    // const userID = this.authService.decodeJwtToken()['uid'];
    // this.events$ =  Observable.of([]);
    const eventsApiUrl = environment.apidocs + `v2/API/Events/GetEvents?pageSize=50&pageOffset=0&sortField=EventName&eventTypeId=${eventTypeId}`;
    this.events$ = this.eventsService.getApi(eventsApiUrl).pipe(
      map(res => {
        return res['Data']['Records'].map((item: any, index) => {
          return {
            id: item.EventID,
            start: new Date(item.EventStartDate),
            end: new Date(item.EventEndDate),
            title: item.EventName,
            color: this.isEven(index) ? colors.yellow : colors.blue,
            allDay: true,
            meta: item
          };
        });
      })
    );
  }

  isEven(value) {
    if (value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }

  // addEvent(): void {
  //   this.events$.push({
  //     title: 'New event',
  //     start: startOfDay(new Date()),
  //     end: endOfDay(new Date()),
  //     color: colors.red,
  //     draggable: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     }
  //   });
  //   this.refresh.next();
  // }

}
