import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(
        'http://localhost:3000/api/posts/' + queryParams
      )
      .pipe(
        map(
          (postData) => {
        return {posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
      })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

getPost(id: string) {
return this.http.get<{_id: string, title: string, content: string, imagePath: string}>
('http://localhost:3000/api/posts/' + id);
}

  addPost(title1: string, content1: string, image: File) {
    const postData = new FormData();
    postData.append('title', title1);
    postData.append('content', content1);
    postData.append('image', image, title1);
    this.http
      .post<{ message: string, post: Post }>
      ('http://localhost:3000/api/posts',
      postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

updatePost(id1: string, title1: string, content1: string, image: File | string) {
  let postData: Post | FormData;
  if ( typeof image === 'object') {
    postData = new FormData();
    postData.append('id', id1);
    postData.append('title', title1);
    postData.append('content', content1);
    postData.append('image', image, title1);
  } else {
  postData = {
    id: id1 ,
    title: title1 ,
    content: content1,
    imagePath: image
  };
  }
  this.http.put('http://localhost:3000/api/posts/' + id1 , postData)
.subscribe(response => {
this.router.navigate(['/']);
});
}


  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}

