import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
  };
  posts: Post[];  
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getUsersWithPosts(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      mergeMap(users => {

        const userPostsObservables = users.map(user => 
          this.getUserPosts(user.id).pipe(
            map(posts => ({
              ...user,
              posts: posts
            }))
          )
        );


        return forkJoin(userPostsObservables);
      }),
      catchError(this.handleError)
    );
  }


  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsUrl}?userId=${userId}`).pipe(
      catchError(() => of([])) 
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}