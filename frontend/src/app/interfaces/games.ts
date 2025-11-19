export interface Games {
  id: number,
  cover?: Cover,
  first_release_date?: number,
  genres?: Genres[],
  involved_companies?: InvolvedCompanies[],
  name?: string,
  platforms?: Platforms[],
  screenshots?: ScreenShots[],
  summary?: string,
  videos?: Videos[],
  rating?: number,
  storyline?:string
}

export interface Cover{
  "id": number,
  "url": string
}

export interface ScreenShots {
  "id": number,
  "url": string
}

export interface  Videos{
  "id": number,
  "video_id": string
}

export interface Platforms{
  "id": number,
  "name": string
}

export interface Genres{
  "id": number,
  "name": string
}

export interface InvolvedCompanies {
  "id": number,
  "company": Company
}

export  interface Company {
  "id": number,
  "name": string
}
