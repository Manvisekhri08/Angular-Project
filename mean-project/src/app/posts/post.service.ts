import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

getPost(id: string) {
return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
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
        const post: Post = {
          id: responseData.post.id,
          title: title1,
          content: content1,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

updatePost(id1: string, title1: string, content1: string) {
  const post: Post = { id: id1 , title: title1 , content: content1, imagePath: null};
  this.http.put('http://localhost:3000/api/posts/' + id1 , post)
.subscribe(response => {
const updatedPosts = [...this.posts];
const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
updatedPosts[oldPostIndex] = post;
this.posts = updatedPosts;
this.postsUpdated.next([...this.posts]);
this.router.navigate(['/']);
});
}


  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}

