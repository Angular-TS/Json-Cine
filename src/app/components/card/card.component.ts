import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { HttpDataService } from 'src/app/services/http-data.service';
import { MoviesComponent } from '../movies/movies.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnChanges {
  @Input() movie!: Movie;
  originalMovie: Movie;

  constructor(private httpDataService: HttpDataService) {
    this.originalMovie = {
      id: '',
      name: '',
      photo: '',
      duration: '',
      genre: ''
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      this.originalMovie = { ...this.movie };
    }
  }

  isEditMode = false;
  @Output() onDelete = new EventEmitter<void>();

  showForm() {
    this.isEditMode = true;
  }

  
  deleteForm() {
    if (confirm('¿Está seguro de que desea eliminar esta película?')){
      this.httpDataService.deleteItem(this.movie.id).subscribe(
        () => {
          this.onDelete.emit();  
        },
        (err) => {
          console.error('Error deleting the movie', err);
        }
      );
    }
  }

  confirmForm(): void {
    if(this.movie) {
      this.httpDataService.updateItem(this.movie.id, this.movie).subscribe (
        (update) => {
          this.movie = update;
          this.isEditMode = false;
        },
        (err) => {
          console.error('Movie update failed', err);
        }
      );
    }
  }

  cancelForm() {
    this.isEditMode = false;
  }
}
