import { Component, OnInit, ViewChild } from '@angular/core';
import {IonAccordionGroup, Platform} from '@ionic/angular';
import {Calendar} from '@awesome-cordova-plugins/calendar/ngx';

interface IName {
  id: string;
  name: string;
}

interface IEvent {
  id: string;
  title: string;
  location: string;
  message: string;
  startDate: string;
  endDate: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  @ViewChild('accordionGroup', {static: false}) private accordionGroup!: IonAccordionGroup
  listNames: IName[] = [];
  listEvents: IEvent[] = [];
  constructor(
    private platform: Platform,
    private calendar: Calendar
  ) {}

  async ngOnInit() {
    await this.checkPermission();
    this.calendar.listCalendars().then( (names) => {
      this.listNames = names;
    }).catch(err => {
      console.info({err});
    });
  }

  openCalendar() {
    this.calendar.openCalendar(new Date()).then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
  }

  async addEvent(title: string, location?: string, notes?: string, startDate?: Date, endDate?: Date) {
    this.calendar.createEventInteractively(title, location, notes, startDate, endDate).then( result => {
      console.log(JSON.stringify(result));
    }).catch( err => {
      console.log(JSON.stringify(err));
    });
  }

  async checkPermission() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      const result = await this.calendar.hasReadWritePermission();
      if (result === false) {
        await this.calendar.requestReadWritePermission();
      }
    }
  }

  async createEvent() {
    await this.addEvent('New event ionic expert', 'Yakima WA', 'Ionic expert notes example');
  }

  async deleteEvent(event: IEvent) {
    this.calendar.deleteEventById(event.id).then().finally( () => {
      this.listEvents = this.listEvents.filter(item => item.id !== event.id);
    });
  }

  onChange() {
    const calendarName = this.accordionGroup.value ? this.accordionGroup.value.toString() : '';
    this.calendar.findAllEventsInNamedCalendar(calendarName).then( (events) => {
      this.listEvents = events;
      console.log({events});
    }).catch( err => {
      console.info({err});
    });
  }

}
