import { Component, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef  } from '@angular/core';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Movie } from 'src/app/models/movie.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  movies: Movie[] = [];

  constructor(private httpDataService: HttpDataService, private snackBar: MatSnackBar) {
    this.movieData = { } as Movie;
  }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.httpDataService.getList().subscribe((data: any) => {
      this.movies = data.sort((a: Movie, b: Movie) => b.id - a.id);
    });
  }

  deleteMovie(index: number) {
    this.movies.splice(index, 1);
    this.snackBar.open('PELICULA ELIMINADA CORRECTAMENTE', '', { duration: 3000 });
  }

  isVisible = false;
  showForm() {
    this.isVisible = true;
  }

  hideForm() {
    this.isVisible = false;
  }

  onSubmit(){
    if(this.studentForm.form.valid){ this.addMovie(); }
    else { console.log("Invalid data"); }
  }
  
  @ViewChild('studentForm', { static: false }) studentForm!: NgForm; 
  movieData!: Movie;

  addMovie() {
    this.httpDataService.createItem(this.movieData).subscribe(
      (newMovie: Movie) => {
        this.movies.unshift(newMovie);
        this.snackBar.open('PELICULA AGREGADA CORRECTAMENTE', '', { duration: 3000 });
      },
      (err) => {
        console.error('Error updating the movie', err);
      }
     );
  }
}
