import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Leader } from '../Shared/leader';
import { LeaderService } from '../services/leader.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
@Input()

  leader: Leader;
  leaders: Leader[];

  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
  this.leaderService.getLeaders()
  .then(leaders => this.leaders = leaders);
  }

}


