import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { Feedback } from '../shared/feedback';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
@Input()
  
  feedbackForm: FormGroup;
  feedback: Feedback;
comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;


  constructor(private dishService: DishService, 
    private route: ActivatedRoute,
    private location: Location, 
    private fb: FormBuilder
    ) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish =>  { this.dish = dish; this.setPrevNext(dish.id);  });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds [(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds [(this.dishIds.length + index + 1) % this.dishIds.length];
  }

 goBack(): void {
   this.location.back();
 }

 createForm() {
   this.feedbackForm = this.fb.group({
     author: '',
     rating: '',
     comment: ''
   });
 }
}
