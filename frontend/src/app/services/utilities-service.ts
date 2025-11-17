import platformIcons from '../../json/platformIcons.json';
import genreIcons from '../../json/genresIcons.json';


export function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


export function transformDate(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}


export function cleanUrlImage(url: string){
  url = url.replace(/\\/g, '/');
  return url
}


export function getImage(url: string | undefined, type: string = 't_cover_big'){
  const imageUrl = url?.replace('t_thumb', type);
  return imageUrl;
}

export function getLocalImage(name: string){
  return 'http://localhost:3000/uploads/'+name
}


export function getPlatformIcon(platformId: number) {
  const p = platformIcons.find(p => p.id === platformId);
  return p ? p.icon : '';
}

export function getGenreIcon(genreId: number) {
  const p = genreIcons.find(p => p.id === genreId);
  return p ? p.icon : '';
}

export function getMediaValue(array: any[]): number {
  if (!array || array.length === 0) return 0;

  const total = array.reduce((acc, el) => acc + Number(el.value), 0);
  const media = total / array.length;

  return Math.round(media * 10) / 10;
}


export function getPlatforms(){
  return platformIcons;
}

export function getGenres(){
  return genreIcons;
}


