import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Games } from '../interfaces/games';
import { Valoration } from '../interfaces/valoration';

const gameSeeds: Games[] = [
  { id: 1, name: 'Baldur’s Gate 3', cover: { id: 1, url: '//images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg' }, genres: [{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1691020800, rating:96, summary:'Reúne a tu grupo y vuelve a los Reinos Olvidados en una historia de amistad, traición, sacrificio y supervivencia.', storyline:'Una fuerza misteriosa despierta en tu interior. Resiste, o abraza la corrupción y conviértete en el mal definitivo.', screenshots:[], videos:[] },
  { id: 2, name: 'Elden Ring', cover: { id: 2, url: '//images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg' }, genres:[{id:12,name:'RPG'},{id:25,name:'Hack and slash/Beat ’em up'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:48,name:'PlayStation 4'},{id:49,name:'Xbox One'},{id:167,name:'PlayStation 5'}], first_release_date:1645747200, rating:94, summary:'Levántate, Sinluz, y déjate guiar por la gracia para blandir el poder del Círculo de Elden.', storyline:'Explora las Tierras Intermedias, descubre sus secretos y decide el destino de un mundo en ruinas.', screenshots:[], videos:[] },
  { id: 3, name: 'The Witcher 3: Wild Hunt', cover:{id:3,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg'}, genres:[{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:48,name:'PlayStation 4'},{id:49,name:'Xbox One'},{id:130,name:'Nintendo Switch'}], first_release_date:1431993600, rating:93, summary:'Eres Geralt de Rivia, cazador de monstruos. Recorre un continente devastado por la guerra.', storyline:'Encuentra a Ciri mientras el mundo cambia a tu alrededor y cada decisión tiene consecuencias.', screenshots:[], videos:[] },
  { id: 4, name: 'Cyberpunk 2077', cover:{id:4,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg'}, genres:[{id:12,name:'RPG'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1608076800, rating:86, summary:'Conviértete en mercenario en Night City, una megalópolis obsesionada con el poder y la modificación corporal.', storyline:'Tu vida cambiará cuando un implante experimental te conecte con una leyenda del pasado.', screenshots:[], videos:[] },
  { id: 5, name: 'Hollow Knight', cover:{id:5,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg'}, genres:[{id:8,name:'Platform'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:48,name:'PlayStation 4'}], first_release_date:1498003200, rating:88, summary:'Desciende a un vasto reino subterráneo de insectos y héroes, lleno de secretos y criaturas extrañas.', storyline:'Explora cavernas retorcidas, combate enemigos corrompidos y desvela el misterio de Hallownest.', screenshots:[], videos:[] },
  { id: 6, name: 'Stardew Valley', cover:{id:6,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co4k3e.jpg'}, genres:[{id:13,name:'Simulator'},{id:15,name:'Strategy'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:48,name:'PlayStation 4'}], first_release_date:1456358400, rating:89, summary:'Hereda la vieja granja de tu abuelo y empieza una nueva vida en el valle.', storyline:'Cultiva, pesca, explora las minas y crea vínculos con los habitantes del pueblo.', screenshots:[], videos:[] },
  { id: 7, name: 'Hades', cover:{id:7,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co5x4y.jpg'}, genres:[{id:25,name:'Hack and slash/Beat ’em up'},{id:12,name:'RPG'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1599696000, rating:93, summary:'Desafía al dios de los muertos y lucha para escapar del Inframundo.', storyline:'Cada intento de huida te acerca a la verdad sobre tu familia y el reino de Hades.', screenshots:[], videos:[] },
  { id: 8, name: 'The Elder Scrolls V: Skyrim', cover:{id:8,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1x7d.jpg'}, genres:[{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:48,name:'PlayStation 4'},{id:49,name:'Xbox One'},{id:130,name:'Nintendo Switch'}], first_release_date:1320969600, rating:94, summary:'Explora una tierra de montañas, dragones y antiguas leyendas en un mundo abierto.', storyline:'El regreso de los dragones amenaza Skyrim y solo tú puedes enfrentarte a su destino.', screenshots:[], videos:[] },
  { id: 9, name: 'Mass Effect Legendary Edition', cover:{id:9,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg'}, genres:[{id:12,name:'RPG'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1620950400, rating:88, summary:'Vive la legendaria trilogía de ciencia ficción y reúne a una tripulación para salvar la galaxia.', storyline:'Las decisiones de Shepard marcarán el destino de las especies de la galaxia.', screenshots:[], videos:[] },
  { id: 10, name: 'Dragon Age: Inquisition', cover:{id:10,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1x7h.jpg'}, genres:[{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:48,name:'PlayStation 4'},{id:49,name:'Xbox One'}], first_release_date:1417478400, rating:85, summary:'Lidera la Inquisición y restaura el orden en un mundo al borde del caos.', storyline:'Cierra la Brecha y construye alianzas en una aventura donde cada decisión importa.', screenshots:[], videos:[] },
  { id: 11, name: 'Resident Evil 4', cover:{id:11,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg'}, genres:[{id:31,name:'Adventure'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1679529600, rating:93, summary:'Leon S. Kennedy viaja a una remota aldea europea para rescatar a la hija del presidente.', storyline:'Una misión de rescate se convierte en una lucha desesperada por sobrevivir.', screenshots:[], videos:[] },
  { id: 12, name: 'Baldur’s Gate 3: Deluxe', cover:{id:12,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg'}, genres:[{id:12,name:'RPG'}], platforms:[{id:6,name:'PC (Microsoft Windows)'}], first_release_date:1691020800, rating:95, summary:'Una aventura de rol con decisiones difíciles, compañeros inolvidables y combates tácticos.', storyline:'Tu historia depende de las alianzas que forjes y los riesgos que decidas asumir.', screenshots:[], videos:[] },
  { id: 13, name: 'Final Fantasy VII Rebirth', cover:{id:13,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co7n1z.jpg'}, genres:[{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:167,name:'PlayStation 5'}], first_release_date:1709164800, rating:92, summary:'Cloud y sus compañeros abandonan Midgar y se adentran en un mundo mucho más amplio.', storyline:'Persigue a Sephiroth y descubre una nueva interpretación de un clásico inolvidable.', screenshots:[], videos:[] },
  { id: 14, name: 'Red Dead Redemption 2', cover:{id:14,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg'}, genres:[{id:31,name:'Adventure'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:48,name:'PlayStation 4'},{id:49,name:'Xbox One'}], first_release_date:1540425600, rating:96, summary:'La banda de Van der Linde huye mientras el fin del Salvaje Oeste se acerca.', storyline:'Arthur Morgan deberá elegir entre la lealtad a su banda y sus propios principios.', screenshots:[], videos:[] },
  { id: 15, name: 'God of War Ragnarök', cover:{id:15,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg'}, genres:[{id:12,name:'RPG'},{id:25,name:'Hack and slash/Beat ’em up'}], platforms:[{id:167,name:'PlayStation 5'},{id:6,name:'PC (Microsoft Windows)'}], first_release_date:1668038400, rating:94, summary:'Kratos y Atreus recorren los Nueve Reinos mientras se acerca el Ragnarök.', storyline:'Padre e hijo buscan respuestas y deben decidir qué están dispuestos a sacrificar.', screenshots:[], videos:[] },
  { id: 16, name: 'Persona 5 Royal', cover:{id:16,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg'}, genres:[{id:12,name:'RPG'},{id:15,name:'Strategy'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1571875200, rating:95, summary:'Lleva una doble vida como estudiante y Ladrón Fantasma en Tokio.', storyline:'Cambia los corazones corruptos y descubre los secretos de una conspiración mayor.', screenshots:[], videos:[] },
  { id: 17, name: 'Control', cover:{id:17,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1ncu.jpg'}, genres:[{id:5,name:'Shooter'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'}], first_release_date:1566259200, rating:85, summary:'Explora una agencia secreta invadida por una presencia sobrenatural.', storyline:'Jesse Faden busca a su hermano mientras intenta dominar poderes imposibles.', screenshots:[], videos:[] },
  { id: 18, name: 'The Last of Us Part I', cover:{id:18,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co5xex.jpg'}, genres:[{id:31,name:'Adventure'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'}], first_release_date:1661817600, rating:89, summary:'Joel y Ellie atraviesan una América devastada por una infección.', storyline:'Una misión de supervivencia se convierte en un vínculo que cambiará sus vidas.', screenshots:[], videos:[] },
  { id: 19, name: 'Horizon Forbidden West', cover:{id:19,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg'}, genres:[{id:31,name:'Adventure'},{id:12,name:'RPG'}], platforms:[{id:167,name:'PlayStation 5'},{id:6,name:'PC (Microsoft Windows)'}], first_release_date:1645747200, rating:88, summary:'Acompaña a Aloy hacia una frontera peligrosa llena de amenazas y misterios.', storyline:'Busca el origen de una plaga que amenaza con acabar con toda la vida.', screenshots:[], videos:[] },
  { id: 20, name: 'Dishonored 2', cover:{id:20,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1u4e.jpg'}, genres:[{id:31,name:'Adventure'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 4'}], first_release_date:1478822400, rating:88, summary:'Elige entre dos asesinos sobrenaturales en una aventura de sigilo y venganza.', storyline:'Recupera el trono y decide cómo cambiará el Imperio de las Islas.', screenshots:[], videos:[] },
  { id: 21, name: 'Ori and the Will of the Wisps', cover:{id:21,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1x7d.jpg'}, genres:[{id:8,name:'Platform'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:49,name:'Xbox One'}], first_release_date:1584489600, rating:90, summary:'Embárcate en una aventura de plataformas en un mundo hermoso y peligroso.', storyline:'Descubre el verdadero destino de Ori y ayuda a restaurar un mundo en peligro.', screenshots:[], videos:[] },
  { id: 22, name: 'Dead Cells', cover:{id:22,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1q5f.jpg'}, genres:[{id:8,name:'Platform'},{id:25,name:'Hack and slash/Beat ’em up'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1532995200, rating:87, summary:'Un roguelite de acción rápido con niveles cambiantes y combates exigentes.', storyline:'Descubre qué ocurrió en una isla maldita mientras vuelves a intentarlo una y otra vez.', screenshots:[], videos:[] },
  { id: 23, name: 'Celeste', cover:{id:23,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1x7d.jpg'}, genres:[{id:8,name:'Platform'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1516665600, rating:91, summary:'Ayuda a Madeline a superar sus demonios interiores durante el ascenso a la montaña Celeste.', storyline:'Una aventura de plataformas sobre la perseverancia, la ansiedad y el autodescubrimiento.', screenshots:[], videos:[] },
  { id: 24, name: 'Alan Wake 2', cover:{id:24,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co6b5v.jpg'}, genres:[{id:31,name:'Adventure'},{id:5,name:'Shooter'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1698364800, rating:89, summary:'Dos protagonistas quedan atrapados en una historia de terror sobrenatural.', storyline:'Una escritora intenta escapar de una realidad que parece obedecer a sus palabras.', screenshots:[], videos:[] },
  { id: 25, name: 'NieR: Automata', cover:{id:25,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'}, genres:[{id:12,name:'RPG'},{id:25,name:'Hack and slash/Beat ’em up'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1488240000, rating:89, summary:'Androides de combate luchan para recuperar un planeta dominado por máquinas.', storyline:'Una misión militar se transforma en una reflexión sobre la conciencia y la humanidad.', screenshots:[], videos:[] },
  { id: 26, name: 'It Takes Two', cover:{id:26,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co2n7z.jpg'}, genres:[{id:8,name:'Platform'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:167,name:'PlayStation 5'},{id:169,name:'Xbox Series X|S'}], first_release_date:1616630400, rating:88, summary:'Una aventura cooperativa en la que dos personas deben aprender a trabajar juntas.', storyline:'Cody y May emprenden un viaje fantástico para reconstruir su relación.', screenshots:[], videos:[] },
  { id: 27, name: 'Sea of Stars', cover:{id:27,url:'//images.igdb.com/igdb/image/upload/t_cover_big/co6r3u.jpg'}, genres:[{id:12,name:'RPG'},{id:31,name:'Adventure'}], platforms:[{id:6,name:'PC (Microsoft Windows)'},{id:130,name:'Nintendo Switch'},{id:167,name:'PlayStation 5'}], first_release_date:1692748800, rating:86, summary:'Dos Hijos del Solsticio combinan sus poderes para enfrentarse a una antigua amenaza.', storyline:'Un RPG de inspiración clásica con exploración, puzles y un mundo lleno de secretos.', screenshots:[], videos:[] }
];

const seedReviews: any[] = [
  { id:'seed-1', gameId:'1', userId:2, value:'10', description:'Una aventura increíble. Personajes y decisiones que se quedan contigo mucho después de terminar.', createdAt:'2026-09-20T18:20:00.000Z', updatedAt:'2026-09-20T18:20:00.000Z', User:{email:'jugador@example.com',Images:[]} },
  { id:'seed-2', gameId:'1', userId:3, value:'9', description:'Muchísima libertad y una historia que invita a experimentar con cada partida.', createdAt:'2026-09-18T12:30:00.000Z', updatedAt:'2026-09-18T12:30:00.000Z', User:{email:'aventurera@example.com',Images:[]} },
  { id:'seed-3', gameId:'2', userId:4, value:'9', description:'Un mundo fascinante y combates que recompensan aprender de cada error.', createdAt:'2026-09-17T09:15:00.000Z', updatedAt:'2026-09-17T09:15:00.000Z', User:{email:'sinluz@example.com',Images:[]} },
  { id:'seed-4', gameId:'3', userId:5, value:'10', description:'Una historia enorme, misiones memorables y un mundo que apetece recorrer sin prisa.', createdAt:'2026-09-15T14:10:00.000Z', updatedAt:'2026-09-15T14:10:00.000Z', User:{email:'brujo@example.com',Images:[]} }
];

const STORAGE_REVIEWS = 'gamesvote-demo-reviews';
const STORAGE_USER = 'gamesvote-demo-user';
const demoUser = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_USER) || 'null') || { id:1, name:'Jugador', cognames:'Demo', tlf:'600000000', email:'jugador@demo.gamesvote', typ:'user', token:'demo-token', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), Images:[] }; }
  catch { return { id:1, name:'Jugador', cognames:'Demo', tlf:'600000000', email:'jugador@demo.gamesvote', typ:'user', token:'demo-token', Images:[] }; }
};
const readReviews = (): any[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_REVIEWS) || 'null') || [...seedReviews]; } catch { return [...seedReviews]; }
};
const saveReviews = (reviews: any[]) => localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(reviews));
const bodyValue = (body: any, key: string) => body instanceof FormData ? String(body.get(key) ?? '') : String(body?.[key] ?? '');
const response = (body: any, status = 200) => of(new HttpResponse({ status, body }));
const failure = (message: string, status = 400) => throwError(() => new HttpErrorResponse({ status, error: { error: message, message } }));

export const demoApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://localhost:3000/')) return next(req);
  const path = req.url.replace('http://localhost:3000', '').split('?')[0];
  const method = req.method.toUpperCase();

  if (method === 'GET' && path === '/api/igdb/getAllGames') {
    const params = new URL(req.urlWithParams).searchParams;
    const search = (params.get('search') || '').toLowerCase();
    const page = Math.max(1, Number(params.get('page') || 1));
    const limit = Math.max(1, Number(params.get('limit') || 27));
    let filters: any = {};
    try { filters = JSON.parse(params.get('filters') || '{}'); } catch {}
    let games = gameSeeds.filter(g => (g.name || '').toLowerCase().includes(search));
    if (filters.genres?.length) games = games.filter(g => g.genres?.some(x => filters.genres.includes(x.id)));
    if (filters.platforms?.length) games = games.filter(g => g.platforms?.some(x => filters.platforms.includes(x.id)));
    if (filters.minRating != null) games = games.filter(g => (g.rating || 0) / 10 >= Number(filters.minRating));
    if (filters.maxRating != null && Number(filters.maxRating) < 10) games = games.filter(g => (g.rating || 0) / 10 <= Number(filters.maxRating));
    if (filters.sortBy) {
      const dir = filters.sortOrder === 'desc' ? -1 : 1;
      games = [...games].sort((a: any,b: any) => {
        const av = a[filters.sortBy] ?? 0, bv = b[filters.sortBy] ?? 0;
        return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * dir;
      });
    }
    return response(games.slice((page - 1) * limit, page * limit));
  }

  const gameMatch = path.match(/^\/api\/igdb\/getGameById\/(\d+)$/);
  if (method === 'GET' && gameMatch) return response(gameSeeds.filter(g => g.id === Number(gameMatch[1])));

  if (method === 'POST' && path === '/api/auth/login') {
    const user = demoUser();
    if (bodyValue(req.body, 'email')) return response({ access_token:'gamesvote-demo-token', type:'user' });
    return failure('Introduce un correo electrónico', 401);
  }
  if (method === 'POST' && path === '/api/auth/register') {
    const user = { ...demoUser(), name:bodyValue(req.body,'name') || 'Jugador', cognames:bodyValue(req.body,'cognames') || 'Demo', tlf:bodyValue(req.body,'tlf'), email:bodyValue(req.body,'email') || 'jugador@demo.gamesvote' };
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    return response({ access_token:'gamesvote-demo-token', type:'user' }, 201);
  }
  if (method === 'GET' && path === '/api/auth/user') {
    if (!localStorage.getItem('token')) return failure('Inicia sesión para continuar', 401);
    return response(demoUser());
  }
  if (method === 'PUT' && path.startsWith('/api/user')) {
    const user = { ...demoUser(), name:bodyValue(req.body,'name') || demoUser().name, cognames:bodyValue(req.body,'cognames') || demoUser().cognames, tlf:bodyValue(req.body,'tlf') || demoUser().tlf, updatedAt:new Date().toISOString() };
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    return response(user);
  }

  const allReviews = readReviews();
  const byGame = path.match(/^\/api\/valoration\/getAllValorationsByGameId\/(\d+)$/);
  if (method === 'GET' && byGame) return response(allReviews.filter(r => String(r.gameId) === byGame[1]));
  const mineByGame = path.match(/^\/api\/valoration\/getMyValorationsByGameId\/(\d+)$/);
  if (method === 'GET' && mineByGame) return response(localStorage.getItem('token') ? allReviews.filter(r => String(r.gameId) === mineByGame[1] && r.userId === 1) : []);
  if (method === 'GET' && path === '/api/valoration/getMyValorationsByUserId/') {
    if (!localStorage.getItem('token')) return failure('Inicia sesión para continuar', 401);
    return response(allReviews.filter(r => r.userId === 1).map(r => ({...r, game:gameSeeds.find(g => g.id === Number(r.gameId))})));
  }
  const oneReview = path.match(/^\/api\/valoration\/getValorationByIdAndByGameId\/([^/]+)\/(\d+)$/);
  if (method === 'GET' && oneReview) {
    const found = allReviews.find(r => r.id === oneReview[1] && String(r.gameId) === oneReview[2]);
    return found ? response(found) : failure('Reseña no encontrada',404);
  }
  if (method === 'POST' && path === '/api/valoration/') {
    if (!localStorage.getItem('token')) return failure('Inicia sesión para publicar',401);
    const gameId = bodyValue(req.body,'gameId');
    if (allReviews.some(r => String(r.gameId) === gameId && r.userId === 1)) return failure('Ya has valorado este juego',409);
    const now = new Date().toISOString();
    const item = { id:'demo-' + Date.now(), gameId, userId:1, value:bodyValue(req.body,'value') || '0', description:bodyValue(req.body,'description'), createdAt:now, updatedAt:now, User:{email:demoUser().email,Images:[]} };
    allReviews.push(item); saveReviews(allReviews); return response(item,201);
  }
  const reviewById = path.match(/^\/api\/valoration\/([^/]+)$/);
  if (reviewById && method === 'PUT') {
    const updated = allReviews.map(r => r.id === reviewById[1] && r.userId === 1 ? {...r, description:bodyValue(req.body,'description'), value:bodyValue(req.body,'value'), updatedAt:new Date().toISOString()} : r);
    saveReviews(updated); return response(updated.find(r => r.id === reviewById[1]) || {});
  }
  if (reviewById && method === 'DELETE') {
    saveReviews(allReviews.filter(r => !(r.id === reviewById[1] && r.userId === 1)));
    return response({ id:reviewById[1] });
  }
  return next(req);
};
