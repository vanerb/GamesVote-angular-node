import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  getGenreIcon,
  getGenres,
  getPlatformIcon,
  getPlatforms,
} from '../../services/utilities-service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule, NgForOf, NgClass, AsyncPipe, NgIf],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  @Input()
  isPhone: boolean = false;

  @Output()
  search = new EventEmitter<{
    genres?: number[];
    platforms?: number[];
    minRating?: number;
    maxRating?: number;
    sortBy?: string;
    sortOrder?: string;
    year?: number;
    search?: string;
  }>();

  form: FormGroup;

  platformsControl = new FormControl<string>('');

  genresControl = new FormControl<string>('');

  filteredPlatforms!: Observable<
    {
      id: number;
      name: string;
      icon: string;
    }[]
  >;

  filteredGenres!: Observable<
    {
      id: number;
      name: string;
      icon: string;
    }[]
  >;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      order: '',
      platforms: this.formBuilder.array([]),
      genres: this.formBuilder.array([]),
      minRate: 0,
      maxRate: 10,
      isRated: false,
      search: '',
    });
  }

  ngOnInit(): void {
    this.filteredPlatforms = this.platformsControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', getPlatforms())),
    );

    this.filteredGenres = this.genresControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', getGenres())),
    );
  }

  addPlatform(platform: { id: number; name: string }): void {
    const exists = this.platformsFormArray.value.some((item: any) => item.id === platform.id);

    if (!exists) {
      this.platformsFormArray.push(this.formBuilder.control(platform));
    }

    this.platformsControl.setValue('');
  }

  removePlatform(index: number): void {
    this.platformsFormArray.removeAt(index);
  }

  addGenre(genre: { id: number; name: string }): void {
    const exists = this.genresFormArray.value.some((item: any) => item.id === genre.id);

    if (!exists) {
      this.genresFormArray.push(this.formBuilder.control(genre));
    }

    this.genresControl.setValue('');
  }

  removeGenre(index: number): void {
    this.genresFormArray.removeAt(index);
  }

  private _filter(
    value: string,
    array: {
      id: number;
      name: string;
      icon: string;
    }[],
  ): {
    id: number;
    name: string;
    icon: string;
  }[] {
    const filterValue = value.toLowerCase();

    return array.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  get platformsFormArray(): FormArray {
    return this.form.get('platforms') as FormArray;
  }

  get genresFormArray(): FormArray {
    return this.form.get('genres') as FormArray;
  }

  filter(): void {
    const genres: {
      id: number;
      name: string;
      icon: string;
    }[] = this.form.get('genres')?.value || [];

    const platforms: {
      id: number;
      name: string;
      icon: string;
    }[] = this.form.get('platforms')?.value || [];

    const sort: string = this.form.get('order')?.value || '';

    const sortParts = sort.split('__');

    const filters: {
      genres?: number[];
      platforms?: number[];
      minRating?: number;
      maxRating?: number;
      sortBy?: string;
      sortOrder?: string;
      year?: number;
      search?: string;
    } = {
      genres: genres.map((element) => element.id),

      platforms: platforms.map((element) => element.id),

      minRating: this.form.get('minRate')?.value ?? undefined,

      maxRating: this.form.get('maxRate')?.value ?? undefined,

      sortBy: sortParts[0] || undefined,

      sortOrder: sortParts[1] || undefined,

      search: this.form.get('search')?.value || undefined,
    };

    console.log(filters);

    this.search.emit(filters);
  }

  protected readonly getPlatformIcon = getPlatformIcon;

  protected readonly getGenreIcon = getGenreIcon;
}
