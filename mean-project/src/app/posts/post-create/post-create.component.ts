import { Component , EventEmitter , Output , OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { Post } from '../post.model';

import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
enteredContent = '';
enteredTitle = '';
post: Post;
private mode = 'create';
private postId: string;

// postCreated = new EventEmitter<Post>();

constructor( public postsService: PostService, public route: ActivatedRoute) {}

ngOnInit() {
  this.route.paramMap.subscribe(( paramMap: ParamMap ) => {
    if (paramMap.has('postId')) {
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.post = this.postsService.getPost(this.postId);
     } else {
       this.mode = 'create';
       this.postId = null;
       this.post =  {id: '', title: '', content: ''};
     }
  });
}
  // tslint:disable-next-line: align

  onAddPost(form: NgForm) {
  if (form.invalid) {
     return;
    }
  this.postsService.addPost(form.value.title, form.value.content);
  form.resetForm();
}
}
