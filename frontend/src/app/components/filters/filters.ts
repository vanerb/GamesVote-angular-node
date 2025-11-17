import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {getGenreIcon, getGenres, getPlatformIcon, getPlatforms} from '../../services/utilities-service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {map, Observable, startWith} from 'rxjs';
import {MatChipsModule} from '@angular/material/chips';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-filters',
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButton,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgForOf,
    NgClass,
    AsyncPipe,
    MatChipsModule,
    MatSliderModule,
    NgIf

  ],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
  standalone: true
})
export class Filters implements OnInit {
  form!: FormGroup;
  platformsControl = new FormControl('');
  genresControl = new FormControl('');
  @Output() search = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      order: '',
      platforms: this.formBuilder.array([]),
      genres: this.formBuilder.array([]),
      minRate: 0,
      maxRate: 10,
      isRated: false,
    });
  }

  filteredPlatforms!: Observable<{id: number, name: string, icon: string}[]>;

  filteredGenres!: Observable<{id: number, name: string, icon: string}[]>;

  ngOnInit() {
    this.filteredPlatforms = this.platformsControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', getPlatforms()))
    );


    this.filteredGenres = this.genresControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', getGenres()))
    );
  }

  addPlatform(platform: { id: number; name: string }) {
    if (!this.platformsFormArray.value.some((p: any) => p.id === platform.id)) {
      this.platformsFormArray.push(this.formBuilder.control(platform));
    }
    this.platformsControl.setValue('');
  }

  removePlatform(index: number) {
    this.platformsFormArray.removeAt(index);
  }

  addGenre(genre: { id: number; name: string }) {
    if (!this.genresFormArray.value.some((p: any) => p.id === genre.id)) {
      this.genresFormArray.push(this.formBuilder.control(genre));
    }
    this.genresControl.setValue('');
  }

  removeGenre(index: number) {
    this.genresFormArray.removeAt(index);
  }

  private _filter(value: string, array: any[]): any[] {
    const filterValue = value.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  get platformsFormArray(): FormArray {
    return this.form.get('platforms') as FormArray;
  }

  get genresFormArray(): FormArray {
    return this.form.get('genres') as FormArray;
  }

  filter(){

    let genres: {id: number, name: string, icon: string}[] = this.form.get('genres')?.value
    let platforms: {id: number, name: string, icon: string}[] = this.form.get('platforms')?.value

    let sort: string = this.form.get('order')?.value
    let filters: {
      genres?: number[];
      platforms?: number[];
      minRating?: number;
      maxRating?: number;
      sortBy?: string,
      sortOrder?: string,
      year?: number;
    } = {
      genres: genres.map(el => el.id) || [],
      platforms: platforms.map(el => el.id) || [],
      minRating: this.form.get('minRate')?.value || undefined,
      maxRating: this.form.get('maxRate')?.value || undefined,
      sortBy: sort.split('__')[0] || undefined,
      sortOrder: sort.split('__')[1] || undefined
    }

    console.log( filters)

    this.search.emit(filters);
  }

  protected readonly getPlatformIcon = getPlatformIcon;
  protected readonly getGenreIcon = getGenreIcon;
}
