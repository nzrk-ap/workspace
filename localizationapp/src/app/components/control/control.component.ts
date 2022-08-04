import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  save() {
    this.httpService.save('');
    this.successfullySaved = true;
  }

  successfullySaved: boolean = false;

}
