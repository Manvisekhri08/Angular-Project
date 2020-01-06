import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';

import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit , OnDestroy {
posts: Post[] = [];
isLoading = false;
totalPosts = 10;
postsPerPage = 2;
currentPage = 1;
pageSizeOption = [1, 2, 5, 10];
private postsSub: Subscription;

constructor(public postsService: PostService) {}

ngOnInit() {
  this.isLoading = true;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
  this.postsSub = this.postsService.getPostUpdateListener().
subscribe((posts: Post[]) => {
  this.isLoading = false;
  this.posts = posts;
});
}

onChangedPage(pageData: PageEvent) {
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
}

onDelete(postId: string) {
this.postsService.deletePost(postId);
}

ngOnDestroy() {
this.postsSub.unsubscribe();
}
}
