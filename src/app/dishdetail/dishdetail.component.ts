import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../Shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../Shared/comment';
import { Feedback } from '../Shared/feedback';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  dishcopy: Dish;
  prev: string;
  next: string;
  errMess: string;
  @ViewChild('fform') feedbackFormDirective;
  feedbackForm: FormGroup;
  feedback: Feedback;
  comment: Comment;

formErrors = {
  'author': '',
  'comment': ''
};

validationMessages = {
  'author': {
    'required': 'Name is requited.',
    'minlength': 'Name must be at least 2 characters long.'
  },
  'comment': {
    'required': 'Comment is requited.'
  }
}
  



  constructor(private dishService: DishService, 
    private route: ActivatedRoute,
    private location: Location, 
    private fb: FormBuilder,
    @Inject('BaseURL') public baseURL) { 
     
    }

  ngOnInit() {
    this.createForm();

    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);   
     
   this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish =>  { this.dish = dish;   this.setPrevNext(dish.id);  },
      errmess => this.errMess = <any>errmess );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds [(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds [(this.dishIds.length + index + 1) % this.dishIds.length];
  }

 goBack(): void {
   this.location.back();
 }

 createForm(): void {
   this.feedbackForm = this.fb.group({
    author: ['', [Validators.required, Validators.minLength(2)]],
     rating: '5',
     comment: ['', Validators.required]
   });
   this.feedbackForm.valueChanges
   .subscribe(data => this.onValueChanged(data));

 this.onValueChanged();

 }
 onValueChanged(data?: any) {
  if (!this.feedbackForm) { return; }
  const form = this.feedbackForm;
  for (const field in this.formErrors) {
    if (this.formErrors.hasOwnProperty(field)) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }
}
onSubmit() {
  this.comment = this.feedbackForm.value;
  const date = new Date(); 
  this.comment.date = date.toISOString();
  
  this.dishcopy.comments.push(this.comment);
  this.dishService.putDish(this.dishcopy)
    .subscribe(dish =>{
      this.dish = dish; this.dishcopy = dish;},
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; }
    );

  console.log(this.feedback);
  this.feedbackForm.reset({
    author: '',
    rating: '5',
    comment: ''
  });
  this.feedbackFormDirective.resetForm();

}


}
