import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.sass']
})
export class TagComponent implements OnInit {

  @Input() tagIndex: number;
  @Input() tag: string;
  @Input() actionable: boolean;
  @Input() actionMatIcon: string;
  @Input() accent: boolean;


  @Output() actionEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    console.log(
      this.tagIndex, this.tag, this.actionable, this.actionMatIcon, this.accent
    )
  }

  action() {
    this.actionEvent.emit(this.tagIndex);
  }

}
