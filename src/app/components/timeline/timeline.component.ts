import {
  Component,
  AfterViewInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  @Output() setActionIdEvent = new EventEmitter<any>();
  public testsData: any;
  public selectedId: any;
  private computedStyle;

  @ViewChildren('item', {read: ElementRef})
  public items: QueryList<ElementRef>;

  constructor() {
  }

  public ngAfterViewInit(): void {
  }

  /**
   * called from dashboard to transfer the computed testsData to create the timeline
   * @param testsData
   * @param actionId
   */
  public setTestsData(testsData: any, actionId) {
    this.testsData = testsData;
    if (this.testsData) {
      this.computedStyle = this.computeWidthAndColor();
      setTimeout(() => {
        this.items.first.nativeElement.focus();
      }, 0);
    }
    this.setSelectedId(actionId);
  }

  public setSelectedId(id) {
    this.selectedId = id;
  }

  /**
   * determines the colour of the actionId buttons
   * @param action: entry of testsData
   */
  public getClassList(action) {
    let classes = '';

    if (parseInt(this.selectedId) === parseInt(action['Action-Id'])) {
      classes += 'item-selected ';

      if (action['SuccessFul'] === 'true') {
        classes += 'item-selected-success-border ';
      } else if (action['SuccessFul'] === 'false') {
        classes += 'item-selected-danger-border ';
      }
    }

    if (action['SuccessFul'] === 'true') {
      classes += 'list-item-success ';
    } else {
      classes += 'list-item-danger ';
    }

    return "list-group-item circle " + classes;
  }

  /**
   * sends the information, which action was selected by the user to the dashboard component
   * @param event: click event
   * @param selectedActionId: actionId which was clicked
   */
  public sendActionId(event, selectedActionId) {
    this.setSelectedId(selectedActionId);
    this.setActionIdEvent.emit(selectedActionId);
  }

  /**
   * computes the temporal difference between the end time of an action and the start time of the subsequent action
   * @param index: index of testsData entry
   */
  public computeTime(index) {
    let firstDate = new Date(this.testsData[index]['EndTime']);
    let secDate = new Date(this.testsData[index + 1]['StartTime']);
    let duration = secDate.getTime() - firstDate.getTime();
    let hours = Math.floor(duration / (1000 * 60 * 60));
    duration -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(duration / (1000 * 60));
    duration -= minutes * 1000 * 60;
    let seconds = Math.floor(duration / 1000);
    let milSeconds = duration - seconds * 1000;
    let milSecString = milSeconds.toString();

    if (milSeconds < 100) {
      if (milSeconds < 10) {
        milSecString = '00' + milSeconds;
      } else {
        milSecString = '0' + milSeconds;
      }
    }

    if (hours === 0) {
      if (minutes === 0) {
        return seconds + '.' + milSecString + 's';
      } else {
        return minutes + 'm:' + seconds + '.' + milSecString + 's';
      }
    } else {
      return hours + 'h:' + minutes + 'm:' + seconds + '.' + milSecString + 's';
    }
  }

  /**
   * computes the width and the colour of the line between two action buttons according to the maximum time unit
   */
  computeWidthAndColor() {
    let firstDate;
    let secDate;
    let duration;
    let hours;
    let minutes;
    let min_bool = false;

    for (let i = 0; i < this.testsData.length - 1; i++) {
      firstDate = new Date(this.testsData[i]['EndTime']);
      secDate = new Date(this.testsData[i + 1]['StartTime']);
      duration = secDate.getTime() - firstDate.getTime();
      hours = Math.floor(duration / (1000 * 60 * 60));
      duration -= hours * 1000 * 60 * 60;
      minutes = Math.floor(duration / (1000 * 60));
      if (hours !== 0) {
        return {
          'width': "80px",
          'background-color': "#1A237E",
          'height': '4px'
        }
      }
      if (minutes !== 0) {
        min_bool = true;
      }
    }

    if (min_bool) {
      return {
        'width': "65px",
        'background-color': "#303F9F",
        'height': '3px'
      }
    } else {
      return {
        'width': "50px",
        'background-color': "#5C6BC0",
        'height': '2px'
      }
    }
  }
}
