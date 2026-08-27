// ═══════════════════════════════════════════════════════════════════
// CATALOG_DATA — BankaiPlus
// ═══════════════════════════════════════════════════════════════════
// Estructura de cada entrada:
//   title    -> Título en inglés (para búsqueda en TMDB)
//   category -> categoría principal + géneros, separados por coma
//                 principal: series | peliculas | anime | infantil
//                 géneros:   terror, comedia, drama, accion,
//                            cienciaficcion, romance, documental
//   type     -> 'tv' | 'movie'
//   seasons  -> solo para type: 'tv'. Ej: '1', '1 a 4', '1 a 20'
//   tmdb     -> OPCIONAL. Id exacto de TMDB.
//               Usalo cuando el titulo es corto o generico ('War', 'Ted', 'X',
//               'The Ring'): la busqueda por texto ordena por popularidad y
//               devuelve la pelicula equivocada. Con este id se va directo a
//               la ficha correcta. El id sale de la URL de TMDB:
//               themoviedb.org/movie/565  ->  tmdb: 565
// ═══════════════════════════════════════════════════════════════════

const CATALOG_DATA = [
  // ═════════════════════════════════════════════════════════════════
  // SERIES
  // ═════════════════════════════════════════════════════════════════
  { title: '13 Reasons Why', category: 'series, drama', type: 'tv', seasons: '1 a 4' },
  { title: '1899', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Ahsoka', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1' },
  { title: 'All of Us Are Dead', category: 'series, terror, drama', type: 'tv', seasons: '1' },
  { title: 'American Horror Story', category: 'series, terror', type: 'tv', seasons: '1 a 12' },
  { title: 'Andor', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Animal Kingdom', category: 'series, drama', type: 'tv', seasons: '1 a 6' },
  { title: 'Band of Brothers', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Barry', category: 'series, comedia, drama, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Better Call Saul', category: 'series, drama', type: 'tv', seasons: '1 a 6' },
  { title: 'Black Knight', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1' },
  { title: 'Black Mirror', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 7' },
  { title: 'Breaking Bad', category: 'series, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'Chernobyl', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Chespirito', category: 'series, comedia', type: 'tv', seasons: '1' },
  { title: 'Chilling Adventures of Sabrina', category: 'series, terror, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Copycat Killer', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Dahmer', category: 'series, drama, terror', type: 'tv', seasons: '1' },
  { title: 'Dark', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Dave', category: 'series, comedia, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Delete', category: 'series, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Dexter', category: 'series, drama', type: 'tv', seasons: '1 a 8' },
  { title: 'Doom Patrol', category: 'series, accion, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Escape at Dannemora', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Euphoria', category: 'series, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Everybody Hates Chris', category: 'series, comedia', type: 'tv', seasons: '1 a 6' },
  { title: 'Fear the Walking Dead', category: 'series, terror, drama', type: 'tv', seasons: '1 a 8' },
  { title: 'Friends', category: 'series, comedia, romance', type: 'tv', seasons: '1 a 10' },
  { title: 'Futurama', category: 'series, comedia, cienciaficcion', type: 'tv', seasons: '1 a 11' },
  { title: 'Game of Thrones', category: 'series, drama, accion', type: 'tv', seasons: '1 a 8' },
  { title: 'Genius', category: 'series, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Ghoul', category: 'series, terror, drama', type: 'tv', seasons: '1' },
  { title: 'Halo', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Hawkeye', category: 'series, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'His Dark Materials', category: 'series, cienciaficcion', type: 'tv', seasons: '1 a 3' },
  { title: 'House of the Dragon', category: 'series, drama, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'How I Met Your Mother', category: 'series, comedia, romance', type: 'tv', seasons: '1 a 9' },
  { title: 'I\'m a Virgo', category: 'series, comedia', type: 'tv', seasons: '1' },
  { title: 'Insânia', category: 'series, terror', type: 'tv', seasons: '1' },
  { title: 'Invasion', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Invincible', category: 'series, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Lost', category: 'series, drama', type: 'tv', seasons: '1 a 6' },
  { title: 'Love & Death', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Love, Death & Robots', category: 'series, cienciaficcion', type: 'tv', seasons: '1 a 4' },
  { title: 'La chica enmascarada', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'McGregor Forever', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Merlí: Sapere Aude', category: 'series, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Money Heist', tmdb: 71446, category: 'series, accion', type: 'tv', seasons: '1 a 5' },
  { title: 'Money Heist: Korea', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Moon Knight', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Motherland: Fort Salem', category: 'series, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'New Amsterdam', category: 'series, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'New Bandits', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Obi-Wan Kenobi', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1' },
  { title: 'Olive Kitteridge', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'One Piece Live Action', category: 'series, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'One Piece', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Orange is the New Black', category: 'series, drama, comedia', type: 'tv', seasons: '1 a 7' },
  { title: 'Orphan Black', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'Ozark', category: 'series, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Pablo Escobar: El Patron del Mal', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Peaky Blinders', category: 'series, drama', type: 'tv', seasons: '1 a 6' },
  { title: 'Raised by Wolves', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Reacher', category: 'series, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Rick and Morty', category: 'series, comedia, cienciaficcion', type: 'tv', seasons: '1 a 9' },
  { title: 'Rome', category: 'series, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Roswell, New Mexico', category: 'series, drama, cienciaficcion, romance', type: 'tv', seasons: '1 a 4' },
  { title: 'SEAL Team', category: 'series, accion, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Secret Invasion', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Sonic Prime', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Squid Game', category: 'series, accion, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Sr. Ávila', category: 'series, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Star Trek: Strange New Worlds', category: 'series, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Stranger Things', category: 'series, cienciaficcion, terror, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'Succession', category: 'series, drama, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Superman & Lois', category: 'series, accion, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Swamp Thing', category: 'series, terror, drama', type: 'tv', seasons: '1' },
  { title: 'Ted', tmdb: 201834, category: 'series, comedia', type: 'tv', seasons: '1 y 2' },
  { title: 'The Big Bang Theory', category: 'series, comedia', type: 'tv', seasons: '1 a 12' },
  { title: 'The Book of Boba Fett', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1' },
  { title: 'The Boys', category: 'series, accion, comedia, cienciaficcion', type: 'tv', seasons: '1 a 5' },
  { title: 'The Falcon and the Winter Soldier', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'The Fall of the House of Usher', category: 'series, terror, drama', type: 'tv', seasons: '1' },
  { title: 'The Flash', category: 'series, accion, cienciaficcion', type: 'tv', seasons: '1 a 9' },
  { title: 'The Fresh Prince of Bel-Air', category: 'series, comedia, drama', type: 'tv', seasons: '1 a 6' },
  { title: 'The Last of Us', category: 'series, drama, terror', type: 'tv', seasons: '1 a 2' },
  { title: 'The Lord of the Rings: The Rings of Power', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'The Magicians', category: 'series, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'The Mandalorian', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'The Pacific', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'The Peripheral', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'The Purge', category: 'series, terror, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'The Purge', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'The Simpsons', category: 'series, comedia', type: 'tv', seasons: '1 a 33' },
  { title: 'The Sopranos', category: 'series, drama', type: 'tv', seasons: '1 a 7' },
  { title: 'The Walking Dead', category: 'series, terror, drama', type: 'tv', seasons: '1 a 11' },
  { title: 'The Walking Dead: Daryl Dixon', category: 'series, terror, drama, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'The Walking Dead: World Beyond', category: 'series, terror, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'The Witcher', category: 'series, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Theodosia', category: 'series', type: 'tv', seasons: '1' },
  { title: 'This World Can\'t Tear Me Down', category: 'series, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Tokyo Vice', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Twisted Metal', category: 'series, accion, cienciaficcion, comedia', type: 'tv', seasons: '1' },
  { title: 'Two and a Half Men', category: 'series, comedia', type: 'tv', seasons: '1 a 12' },
  { title: 'Vikings', category: 'series, drama, accion', type: 'tv', seasons: '1 a 6' },
  { title: 'Vikings: Valhalla', category: 'series, drama, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Vis a Vis', category: 'series, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'WandaVision', category: 'series, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Warrior', category: 'series, drama, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Wednesday', category: 'series, comedia', type: 'tv', seasons: '1' },
  { title: 'Westworld', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Who Is Erin Carter?', category: 'series, accion', type: 'tv', seasons: '1' },
  { title: 'Why Women Kill', category: 'series, drama, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Young Sheldon', category: 'series, comedia', type: 'tv', seasons: '1 a 6' },
  { title: 'Zombieverse', category: 'series, terror, comedia', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME
  // ═════════════════════════════════════════════════════════════════
  { title: '86', category: 'anime, accion, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Aggretsuko', category: 'anime, comedia, drama', type: 'tv', seasons: '1 a 5' },
  { title: 'Attack on Titan', category: 'anime, accion, drama', type: 'tv', seasons: '1 a 4 (ovas)' },
  { title: 'Baki', category: 'anime, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Baki Dou', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Baki Hanma', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Berserk', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Berserk (2016)', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Berserk: The Golden Age Arc', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Black Clover', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Bleach', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Blue Exorcist', category: 'anime, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Cells at Work', category: 'anime, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Chainsaw Man', category: 'anime, accion, terror', type: 'tv', seasons: '1' },
  { title: 'Claymore', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Code Geass', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'Cyberpunk: Edgerunners', category: 'anime, accion, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Dandadan', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Death Note', category: 'anime, drama', type: 'tv', seasons: '1' },
  { title: 'Demon Slayer: Kimetsu no Yaiba', category: 'anime, accion', type: 'tv', seasons: '1 a 4 y pelicula' },
  { title: 'DOTA: Dragon\'s Blood', category: 'anime, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Dr. Stone', category: 'anime, cienciaficcion, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Dragon Ball Daima', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Dragon Ball Super', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Dragon Ball Z', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Dragon Quest: The Adventure of Dai', category: 'anime', type: 'tv', seasons: '1' },
  { title: 'Elfen Lied', category: 'anime, drama, terror', type: 'tv', seasons: '1' },
  { title: 'Fullmetal Alchemist: Brotherhood', category: 'anime, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Great Teacher Onizuka', category: 'anime, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Hellsing', category: 'anime, accion, terror', type: 'tv', seasons: '1' },
  { title: 'High School of the Dead', category: 'anime, terror, accion', type: 'tv', seasons: '1' },
  { title: 'Housing Complex C', category: 'anime, terror', type: 'tv', seasons: '1' },
  { title: 'Hunter x Hunter', category: 'anime, accion', type: 'tv', seasons: '1 a 6' },
  { title: 'Inuyasha', category: 'anime, accion, romance', type: 'tv', seasons: '1 a 6' },
  { title: 'JoJo\'s Bizarre Adventure', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Jujutsu Kaisen', category: 'anime, accion, terror', type: 'tv', seasons: '1 a 2' },
  { title: 'Junji Ito Collection', category: 'anime, terror', type: 'tv', seasons: '1' },
  { title: 'Junji Ito Maniac: Japanese Tales of the Macabre', category: 'anime, terror', type: 'tv', seasons: '1' },
  { title: 'K-On!', category: 'anime, comedia', type: 'tv', seasons: '0 a 3' },
  { title: 'Little Witch Academia', category: 'anime, comedia', type: 'tv', seasons: '1' },
  { title: 'Mashle: Magic and Muscles', category: 'anime, accion, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Mob Psycho 100', category: 'anime, accion, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'My Hero Academia', category: 'anime, accion', type: 'tv', seasons: '1 a 7' },
  { title: 'Naruto', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Naruto Shippuden', category: 'anime, accion', type: 'tv', seasons: '1 a 20' },
  { title: 'Neon Genesis Evangelion', category: 'anime, cienciaficcion, drama, accion', type: 'tv', seasons: '1' },
  { title: 'NieR: Automata Ver1.1a', category: 'anime, drama, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Ninja Kamui', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Odd Taxi', category: 'anime', type: 'tv', seasons: '1' },
  { title: 'One Punch Man', category: 'anime, accion, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Overlord', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Pluto', category: 'anime, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Record of Ragnarok', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Saint Seiya', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Saint Seiya: Saintia Sho', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Saint Seiya: Soul of Gold', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Saint Seiya: The Hades Chapter', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Saint Seiya: The Lost Canvas', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Serial Experiments Lain', category: 'anime, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Shadows House', category: 'anime, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'SK8 the Infinity', category: 'anime, drama', type: 'tv', seasons: '1' },
  { title: 'Soul Eater', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Spy x Family', category: 'anime, comedia, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Star Wars: Visions', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'Sword Art Online', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Sword Art Online Alternative: Gun Gale Online', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Tekken: Bloodline', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Tengen Toppa Gurren Lagann', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Terra Formars', category: 'anime, terror, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'The Seven Deadly Sins', category: 'anime, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Tokyo Ghoul', category: 'anime, accion, terror, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Tokyo Revengers', category: 'anime, accion, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Uzumaki', category: 'anime, terror', type: 'tv', seasons: '1' },
  { title: 'Vinland Saga', category: 'anime, accion, drama', type: 'tv', seasons: '1 a 2' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME - Películas
  // ═════════════════════════════════════════════════════════════════
  { title: '5 Centimeters per Second', category: 'anime, drama, romance', type: 'movie' },
  { title: 'Akira', category: 'anime, cienciaficcion, accion', type: 'movie' },
  { title: 'Baki Hanma vs Kengan Ashura', category: 'anime, accion', type: 'movie' },
  { title: 'Boruto: Naruto the Movie', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Super: Broly', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Super: Super Hero', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Bardock - The Father of Goku', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Battle of Gods', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Bio-Broly', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Bojack Unbound', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Broly - Second Coming', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Broly - The Legendary Super Saiyan', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Cooler\'s Revenge', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Fusion Reborn', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Lord Slug', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Resurrection \'F\'', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Super Android 13!', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: The World\'s Strongest', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: Wrath of the Dragon', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball: Curse of the Blood Rubies', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball: Mystical Adventure', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball: Sleeping Princess in Devil\'s Castle', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball: The Path to Power', category: 'anime, accion', type: 'movie' },
  { title: 'Ghost in the Shell', category: 'anime, accion, cienciaficcion', type: 'movie' },
  { title: 'La vigilante del futuro: Ghost in the Shell', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Ghost in the Shell 2: Innocence', category: 'anime, accion, cienciaficcion', type: 'movie' },
  { title: 'Ghost in the Shell: Stand Alone Complex - Solid State Society', category: 'anime, accion, cienciaficcion', type: 'movie' },
  { title: 'Ghost in the Shell: The New Movie', category: 'anime, accion, cienciaficcion', type: 'movie' },
  { title: 'My Hero Academia: Heroes Rising', category: 'anime, accion', type: 'movie' },
  { title: 'My Hero Academia: Two Heroes', category: 'anime, accion', type: 'movie' },
  { title: 'My Hero Academia: World Heroes Mission', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto Shippuden the Movie', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto Shippuden the Movie: Blood Prison', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto Shippuden the Movie: Bonds', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto Shippuden the Movie: The Lost Tower', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto Shippuden the Movie: The Will of Fire', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto the Movie 2: Legend of the Stone of Gelel', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto the Movie 3: Guardians of the Crescent Moon Kingdom', category: 'anime, accion', type: 'movie' },
  { title: 'Naruto the Movie: Ninja Clash in the Land of Snow', category: 'anime, accion', type: 'movie' },
  { title: 'Perfect Blue', category: 'anime', type: 'movie' },
  { title: 'Road to Ninja: Naruto the Movie', category: 'anime, accion', type: 'movie' },
  { title: 'Saint Seiya: Legend of Crimson Youth', category: 'anime, accion', type: 'movie' },
  { title: 'Saint Seiya: Legend of Sanctuary', category: 'anime, accion', type: 'movie' },
  { title: 'Saint Seiya: The Heated Battle of the Gods', category: 'anime, accion', type: 'movie' },
  { title: 'Saint Seiya: Warriors of the Final Holy War', category: 'anime, accion', type: 'movie' },
  { title: 'The Last: Naruto the Movie', category: 'anime, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES - Series
  // ═════════════════════════════════════════════════════════════════
  { title: 'Adventure Time', category: 'infantil, comedia', type: 'tv', seasons: '1 a 10' },
  { title: 'Adventure Time: Distant Lands', category: 'infantil, drama', type: 'tv', seasons: '1' },
  { title: 'Adventure Time: Fionna and Cake', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Clarence', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Courage the Cowardly Dog', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'I Am Groot', category: 'infantil, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Regular Show', category: 'infantil, comedia', type: 'tv', seasons: '1 a 8' },
  { title: 'Steven Universe', category: 'infantil, comedia', type: 'tv', seasons: '1 a 5' },
  { title: 'The Grim Adventures of Billy & Mandy', category: 'infantil, comedia', type: 'tv', seasons: '1 a 6' },
  { title: 'We Bare Bears', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES - Películas
  // ═════════════════════════════════════════════════════════════════
  { title: '101 Dalmatians', category: 'infantil, comedia', type: 'movie' },
  { title: '102 Dalmatians', category: 'infantil, comedia', type: 'movie' },
  { title: '9', category: 'infantil, cienciaficcion', type: 'movie' },
  { title: 'Atlantis: Milo\'s Return', category: 'infantil', type: 'movie' },
  { title: 'Atlantis: The Lost Empire', category: 'infantil, cienciaficcion', type: 'movie' },
  { title: 'Cars', category: 'infantil, comedia', type: 'movie' },
  { title: 'Cars 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Cars 3', category: 'infantil, comedia', type: 'movie' },
  { title: 'Coco', category: 'infantil, drama', type: 'movie' },
  { title: 'Coraline', category: 'infantil, terror', type: 'movie' },
  { title: 'Despicable Me 4', category: 'infantil, comedia', type: 'movie' },
  { title: 'Frankenweenie', category: 'infantil, terror, comedia', type: 'movie' },
  { title: 'Frozen', category: 'infantil, comedia', type: 'movie' },
  { title: 'Frozen Fever', category: 'infantil, comedia', type: 'movie' },
  { title: 'Frozen II', category: 'infantil, comedia', type: 'movie' },
  { title: 'Iron Man & Captain America: Heroes United', category: 'infantil, accion', type: 'movie' },
  { title: 'Lego Star Wars: The Padawan Menace', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'Madagascar', category: 'infantil, comedia', type: 'movie' },
  { title: 'Madagascar 3: Europe\'s Most Wanted', category: 'infantil, comedia', type: 'movie' },
  { title: 'Madagascar: Escape 2 Africa', category: 'infantil, comedia', type: 'movie' },
  { title: 'Marvel Super Hero Adventures: Frost Fight!', category: 'infantil, accion', type: 'movie' },
  { title: 'Mike\'s New Car', category: 'infantil, comedia', type: 'movie' },
  { title: 'Monsters University', category: 'infantil, comedia', type: 'movie' },
  { title: 'Monsters, Inc.', category: 'infantil, comedia', type: 'movie' },
  { title: 'Olaf\'s Frozen Adventure', category: 'infantil, comedia', type: 'movie' },
  { title: 'Once Upon a Snowman', category: 'infantil, comedia', type: 'movie' },
  { title: 'Party Central', category: 'infantil, comedia', type: 'movie' },
  { title: 'Rio', category: 'infantil, comedia', type: 'movie' },
  { title: 'Rio 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Shrek', category: 'infantil, comedia', type: 'movie' },
  { title: 'Shrek 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Shrek Forever After', category: 'infantil, comedia', type: 'movie' },
  { title: 'Shrek the Halls', category: 'infantil, comedia', type: 'movie' },
  { title: 'Shrek the Third', category: 'infantil, comedia', type: 'movie' },
  { title: 'Spider-Man: Into the Spider-Verse', category: 'infantil, accion', type: 'movie' },
  { title: 'Star Wars: The Clone Wars', category: 'infantil, accion, cienciaficcion', type: 'movie' },
  { title: 'The Lion King', category: 'infantil, drama', type: 'movie' },
  { title: 'The Lion King (2019)', category: 'infantil, drama', type: 'movie' },
  { title: 'The Lion King 1½', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Lion King II: Simba\'s Pride', category: 'infantil, drama', type: 'movie' },
  { title: 'The Monkey King', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Nightmare Before Christmas', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Super Mario Galaxy Movie', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story 3', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story 4', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story of Terror!', category: 'infantil, terror, comedia', type: 'movie' },
  { title: 'Toy Story That Time Forgot', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story: Partysaurus Rex', category: 'infantil, comedia', type: 'movie' },
  { title: 'Toy Story: Small Fry', category: 'infantil, comedia', type: 'movie' },
  { title: 'WALL·E', category: 'infantil, cienciaficcion', type: 'movie' },
  { title: 'Zootopia 2', category: 'infantil, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Individuales
  // ═════════════════════════════════════════════════════════════════
  { title: '#Alive', tmdb: 614696, category: 'peliculas, terror', type: 'movie' },
  { title: '(500) Days of Summer', category: 'peliculas, comedia, drama, romance', type: 'movie' },
  { title: '10 Days of a Good Man', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: '10,000 BC', category: 'peliculas, drama, accion', type: 'movie' },
  { title: '100 Meters', category: 'peliculas, drama', type: 'movie' },
  { title: '12 Years a Slave', category: 'peliculas, drama', type: 'movie' },
  { title: '127 Hours', category: 'peliculas, drama', type: 'movie' },
  { title: '1408', category: 'peliculas, terror', type: 'movie' },
  { title: '1917', category: 'peliculas, drama, accion', type: 'movie' },
  { title: '1974: La Posesión de Altair', category: 'peliculas, terror', type: 'movie' },
  { title: '2012', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: '2067', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: '28 Years Later', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: '3 A.M.', category: 'peliculas, terror', type: 'movie' },
  { title: '3 A.M. Part 2', category: 'peliculas, terror', type: 'movie' },
  { title: '365 Days', category: 'peliculas, drama, romance', type: 'movie' },
  { title: '365 Days: This Day', category: 'peliculas, drama, romance', type: 'movie' },
  { title: '4 Mitades', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: '42', category: 'peliculas, drama', type: 'movie' },
  { title: '42 to 1', category: 'peliculas, drama', type: 'movie' },
  { title: '47 Ronin', category: 'peliculas, accion', type: 'movie' },
  { title: '4X4', category: 'peliculas, drama', type: 'movie' },
  { title: '7 Prisoners', category: 'peliculas, drama', type: 'movie' },
  { title: '7 Women and a Murder', category: 'peliculas, comedia', type: 'movie' },
  { title: '7th & Union', category: 'peliculas, drama', type: 'movie' },
  { title: '8 Mile', category: 'peliculas, drama', type: 'movie' },
  { title: '8-Bit Christmas', category: 'peliculas, comedia', type: 'movie' },
  { title: '93 Days', category: 'peliculas, drama', type: 'movie' },
  { title: 'A Classic Horror Story', category: 'peliculas, terror', type: 'movie' },
  { title: 'A Clockwork Orange', category: 'peliculas, drama', type: 'movie' },
  { title: 'A Haunted House', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'A la Mala', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'A Minecraft Movie', category: 'peliculas, comedia', type: 'movie' },
  { title: 'A Monster Calls', category: 'peliculas, drama', type: 'movie' },
  { title: 'A Nice Girl Like You', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Abandon', category: 'peliculas', type: 'movie' },
  { title: 'Abducted', category: 'peliculas, accion', type: 'movie' },
  { title: 'Abuelos', tmdb: 684710, category: 'peliculas, comedia', type: 'movie' },
  { title: 'Ace Ventura Jr.: Pet Detective', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Ace Ventura: Pet Detective', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Ad Astra', category: 'peliculas, drama, cienciaficcion', type: 'movie' },
  { title: 'Afterlife of the Party', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Akelarre', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Aladdin', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alien: Romulus', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'American Carnage', category: 'peliculas, terror', type: 'movie' },
  { title: 'American Horror House', category: 'peliculas, terror', type: 'movie' },
  { title: 'Anaconda', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'Angels & Demons', category: 'peliculas, accion', type: 'movie' },
  { title: 'Annihilation', category: 'peliculas, terror, drama, cienciaficcion', type: 'movie' },
  { title: 'Apartment 1303', category: 'peliculas, terror', type: 'movie' },
  { title: 'Apex', category: 'peliculas, accion', type: 'movie' },
  { title: 'Apocalypto', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Aquaman', category: 'peliculas, accion', type: 'movie' },
  { title: 'Arrival', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Artemis Fowl', category: 'peliculas', type: 'movie' },
  { title: 'As Above, So Below', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'As the Gods Will', category: 'peliculas, accion', type: 'movie' },
  { title: 'Assassin\'s Creed', category: 'peliculas, accion', type: 'movie' },
  { title: 'Assault on Wall Street', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Astro Boy', category: 'peliculas, accion', type: 'movie' },
  { title: 'BAC Nord', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Bad Boys for Life', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Bad Boys: Ride or Die', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Bad Trip', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Batman Azteca: Clash of Empires', category: 'peliculas, accion', type: 'movie' },
  { title: 'Beetlejuice Beetlejuice', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Borderlands', category: 'peliculas, comedia, accion, cienciaficcion', type: 'movie' },
  { title: 'Romper el círculo', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Bring Her Back', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Bulletproof', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Captain America: Brave New World', category: 'peliculas, accion', type: 'movie' },
  { title: 'Catch Me If You Can', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Child\'s Play', category: 'peliculas, terror', type: 'movie' },
  { title: 'Cocaine Bear', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'Da 5 Bloods', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Deepwater Horizon', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Drag Me to Hell', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Dumbo', category: 'peliculas, drama', type: 'movie' },
  { title: 'Dunkirk', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Edward Scissorhands', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Elio', category: 'peliculas, comedia, cienciaficcion', type: 'movie' },
  { title: 'Proyecto Fin del Mundo', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'F*ck Love Too', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Five Feet Apart', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Five Weddings', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Frankenstein (2025)', category: 'peliculas, terror, drama, cienciaficcion', type: 'movie' },
  { title: 'Gravity', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Green Book', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Greenland', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Heaven\'s Door', category: 'peliculas, drama', type: 'movie' },
  { title: 'Heroic', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Así Crecí', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'How to Train Your Dragon', category: 'peliculas', type: 'movie' },
  { title: 'Hunter Killer', category: 'peliculas, accion', type: 'movie' },
  { title: 'I Am Frankelda', category: 'peliculas, comedia', type: 'movie' },
  { title: 'I Know What You Did Last Summer', category: 'peliculas, terror', type: 'movie' },
  { title: 'IF', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Imaginary', category: 'peliculas, terror', type: 'movie' },
  { title: 'Inception', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Inside Out 2', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Interstellar', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Joker', category: 'peliculas, drama', type: 'movie' },
  { title: 'Jurassic World Rebirth', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Karate Kid: Legends', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Killer Elite', category: 'peliculas, accion', type: 'movie' },
  { title: 'Kingdom of the Planet of the Apes', category: 'peliculas, drama, accion, cienciaficcion', type: 'movie' },
  { title: 'Let\'s Be Cops', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Life of Pi', category: 'peliculas, drama', type: 'movie' },
  { title: 'Lilo & Stitch', category: 'infantil, comedia, cienciaficcion', type: 'movie' },
  { title: 'Longlegs', category: 'peliculas, terror', type: 'movie' },
  { title: 'Materialists', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Me Before You', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Moana 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Napoleon', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Nope', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Not Another Teen Movie', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Peaky Blinders: The Immortal Man', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Perfect Addiction', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Pet Sematary', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Pet Sematary: Bloodlines', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Peter Pan & Wendy', category: 'peliculas', type: 'movie' },
  { title: 'Poltergeist', category: 'peliculas, terror', type: 'movie' },
  { title: 'Power Rangers: Once & Always', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Prometheus', category: 'peliculas, cienciaficcion, terror', type: 'movie' },
  { title: 'Red One', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Risen', category: 'peliculas, drama', type: 'movie' },
  { title: 'Room', category: 'peliculas, drama', type: 'movie' },
  { title: 'Scarface', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Shadow Force', category: 'peliculas, accion', type: 'movie' },
  { title: 'Shutter Island', category: 'peliculas, drama, terror', type: 'movie' },
  { title: 'Sicario', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Sinners', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Sister Death', category: 'peliculas, terror', type: 'movie' },
  { title: 'Skyfall', category: 'peliculas, accion', type: 'movie' },
  { title: 'Sleepy Hollow', category: 'peliculas, terror', type: 'movie' },
  { title: 'Sound of Freedom', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Steve Jobs', category: 'peliculas, drama', type: 'movie' },
  { title: 'Subservience', category: 'peliculas, drama, cienciaficcion', type: 'movie' },
  { title: 'Superman', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Tesla', category: 'peliculas, drama', type: 'movie' },
  { title: 'The 15:17 to Paris', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Black Demon', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Boy in the Striped Pyjamas', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Da Vinci Code', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Departed', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Evil Dead', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Fantastic Four: First Steps', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'The Garfield Movie', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Help', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Hour of Disappearance', category: 'peliculas', type: 'movie' },
  { title: 'Medium', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'The Naked Gun', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Secret Abyss', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Social Network', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Wild Robot', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Wolf of Wall Street', category: 'peliculas, drama, comedia', type: 'movie' },
  { title: 'Thir13en Ghosts', category: 'peliculas, terror', type: 'movie' },
  { title: 'Through My Window', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Thunderbolts*', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Togo', category: 'peliculas, drama', type: 'movie' },
  { title: 'Transformers One', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Underwater', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Vacation Friends', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Venom: The Last Dance', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'War Dogs', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'War of the Worlds', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Warcraft', category: 'peliculas, accion', type: 'movie' },
  { title: 'What Happened to Mr. Cha?', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'What Is He Like', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Whiplash', category: 'peliculas, drama', type: 'movie' },
  { title: 'Wicked', category: 'peliculas, drama', type: 'movie' },
  { title: 'Willy Wonka & the Chocolate Factory', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Willy\'s Wonderland', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'Winchester', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Wish Upon', category: 'peliculas, terror', type: 'movie' },
  { title: 'Wolf', tmdb: 673121, category: 'peliculas, drama', type: 'movie' },
  { title: 'Wonder Park', category: 'peliculas, comedia', type: 'movie' },
  { title: 'X', tmdb: 760104, category: 'peliculas, terror', type: 'movie' },
  { title: 'Yes Day', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Zona de riesgo', category: 'peliculas, drama, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Resident Evil
  // ═════════════════════════════════════════════════════════════════
  { title: 'Resident Evil', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: Apocalypse', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: Extinction', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: Afterlife', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: Retribution', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: The Final Chapter', tmdb: 173897, category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Resident Evil: Welcome to Raccoon City', category: 'peliculas, terror, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Harry Potter
  // ═════════════════════════════════════════════════════════════════
  { title: 'Harry Potter and the Philosopher\'s Stone', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Chamber of Secrets', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Prisoner of Azkaban', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Goblet of Fire', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Order of the Phoenix', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Half-Blood Prince', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Deathly Hallows: Part 1', category: 'peliculas, accion', type: 'movie' },
  { title: 'Harry Potter and the Deathly Hallows: Part 2', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Fast & Furious
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Fast and the Furious', category: 'peliculas, accion', type: 'movie' },
  { title: '2 Fast 2 Furious', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Fast and the Furious: Tokyo Drift', category: 'peliculas, accion', type: 'movie' },
  { title: 'Fast & Furious', category: 'peliculas, accion', type: 'movie' },
  { title: 'Fast Five', category: 'peliculas, accion', type: 'movie' },
  { title: 'Fast & Furious 6', category: 'peliculas, accion', type: 'movie' },
  { title: 'Furious 7', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Fate of the Furious', category: 'peliculas, accion', type: 'movie' },
  { title: 'F9', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Star Wars
  // ═════════════════════════════════════════════════════════════════
  { title: 'Star Wars: Episode I - The Phantom Menace', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode II - Attack of the Clones', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode III - Revenge of the Sith', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode IV - A New Hope', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode VI - Return of the Jedi', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode VII - The Force Awakens', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode VIII - The Last Jedi', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Episode IX - The Rise of Skywalker', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Solo: A Star Wars Story', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Rogue One: A Star Wars Story', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: Biomes', category: 'peliculas, documental', type: 'movie' },
  { title: 'The Ewok Adventure', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Ewoks: The Battle for Endor', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Marvel MCU
  // ═════════════════════════════════════════════════════════════════
  { title: 'Iron Man', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Iron Man 2', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Iron Man 3', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Captain America: The First Avenger', category: 'peliculas, accion', type: 'movie' },
  { title: 'Captain America: The Winter Soldier', category: 'peliculas, accion', type: 'movie' },
  { title: 'Captain America: Civil War', category: 'peliculas, accion', type: 'movie' },
  { title: 'Thor', category: 'peliculas, accion', type: 'movie' },
  { title: 'Thor: The Dark World', category: 'peliculas, accion', type: 'movie' },
  { title: 'Thor: Ragnarok', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Thor: Love and Thunder', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'The Avengers', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Avengers: Age of Ultron', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Avengers: Infinity War', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Avengers: Endgame', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Spider-Man: Homecoming', category: 'peliculas, accion', type: 'movie' },
  { title: 'Spider-Man: Far From Home', category: 'peliculas, accion', type: 'movie' },
  { title: 'Spider-Man: No Way Home', category: 'peliculas, accion', type: 'movie' },
  { title: 'Black Widow', category: 'peliculas, accion', type: 'movie' },
  { title: 'Black Panther', category: 'peliculas, accion', type: 'movie' },
  { title: 'Black Panther: Wakanda Forever', category: 'peliculas, accion', type: 'movie' },
  { title: 'Doctor Strange', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Doctor Strange in the Multiverse of Madness', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Guardians of the Galaxy', category: 'peliculas, accion, comedia, cienciaficcion', type: 'movie' },
  { title: 'Guardians of the Galaxy Vol. 2', category: 'peliculas, accion, comedia, cienciaficcion', type: 'movie' },
  { title: 'Shang-Chi and the Legend of the Ten Rings', category: 'peliculas, accion', type: 'movie' },
  { title: 'Ant-Man', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Ant-Man and the Wasp', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Ant-Man and the Wasp: Quantumania', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Captain Marvel', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'The Incredible Hulk', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Matrix
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Matrix', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Matrix Reloaded', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Matrix Revolutions', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Matrix Resurrections', category: 'peliculas, cienciaficcion, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Jurassic Park
  // ═════════════════════════════════════════════════════════════════
  { title: 'Jurassic Park', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Lost World: Jurassic Park', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Jurassic Park III', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Jurassic World', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Jurassic World: Fallen Kingdom', category: 'peliculas, cienciaficcion, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Pirates of the Caribbean
  // ═════════════════════════════════════════════════════════════════
  { title: 'Pirates of the Caribbean: The Curse of the Black Pearl', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Pirates of the Caribbean: Dead Man\'s Chest', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Pirates of the Caribbean: At World\'s End', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Pirates of the Caribbean: On Stranger Tides', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Pirates of the Caribbean: Dead Men Tell No Tales', category: 'peliculas, accion, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Transformers
  // ═════════════════════════════════════════════════════════════════
  { title: 'Transformers', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Transformers: Revenge of the Fallen', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Transformers: Dark of the Moon', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Transformers: Age of Extinction', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Bumblebee', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Hobbit / LOTR
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Lord of the Rings: The Fellowship of the Ring', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Lord of the Rings: The Two Towers', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Lord of the Rings: The Return of the King', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Hobbit: An Unexpected Journey', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Hobbit: The Desolation of Smaug', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Hobbit: The Battle of the Five Armies', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Terminator
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Terminator', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Terminator 2: Judgment Day', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Terminator 3: Rise of the Machines', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Terminator Salvation', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Terminator Genisys', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Terminator: Dark Fate', category: 'peliculas, cienciaficcion, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga X-Men
  // ═════════════════════════════════════════════════════════════════
  { title: 'Deadpool & Wolverine', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'X-Men', tmdb: 36657, category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X2: X-Men United', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men: The Last Stand', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men: First Class', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men: Days of Future Past', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men: Apocalypse', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men: Dark Phoenix', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Logan', category: 'peliculas, accion, drama', type: 'movie' },
  { title: 'The Wolverine', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'X-Men Origins: Wolverine', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Rocky
  // ═════════════════════════════════════════════════════════════════
  { title: 'Rocky', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Rocky II', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Rocky III', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Rocky IV', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Rocky V', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Rocky Balboa', category: 'peliculas, drama, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Saw
  // ═════════════════════════════════════════════════════════════════
  { title: 'Saw', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw II', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw III', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw IV', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw V', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw VI', category: 'peliculas, terror', type: 'movie' },
  { title: 'Saw 3D', category: 'peliculas, terror', type: 'movie' },
  { title: 'Jigsaw', category: 'peliculas, terror', type: 'movie' },
  { title: 'Spiral: From the Book of Saw', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Halloween
  // ═════════════════════════════════════════════════════════════════
  { title: 'Halloween', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween II', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween III: Season of the Witch', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween 4: The Return of Michael Myers', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween 5: The Revenge of Michael Myers', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween: The Curse of Michael Myers', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween H20: 20 Years Later', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween: Resurrection', category: 'peliculas, terror', type: 'movie' },
  { title: 'Halloween Kills', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga A Quiet Place
  // ═════════════════════════════════════════════════════════════════
  { title: 'A Quiet Place', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'A Quiet Place Part II', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'A Quiet Place: Day One', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Purge
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Purge: Anarchy', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'The Purge: Election Year', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'The First Purge', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'The Forever Purge', category: 'peliculas, terror, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Die Hard
  // ═════════════════════════════════════════════════════════════════
  { title: 'Die Hard', category: 'peliculas, accion', type: 'movie' },
  { title: 'Die Hard 2', category: 'peliculas, accion', type: 'movie' },
  { title: 'Die Hard with a Vengeance', category: 'peliculas, accion', type: 'movie' },
  { title: 'Live Free or Die Hard', category: 'peliculas, accion', type: 'movie' },
  { title: 'A Good Day to Die Hard', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Mission Impossible
  // ═════════════════════════════════════════════════════════════════
  { title: 'Mission: Impossible', category: 'peliculas, accion', type: 'movie' },
  { title: 'Mission: Impossible II', category: 'peliculas, accion', type: 'movie' },
  { title: 'Mission: Impossible III', category: 'peliculas, accion', type: 'movie' },
  { title: 'Mission: Impossible - Ghost Protocol', category: 'peliculas, accion', type: 'movie' },
  { title: 'Mission: Impossible - Rogue Nation', category: 'peliculas, accion', type: 'movie' },
  { title: 'Mission: Impossible - Fallout', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Batman
  // ═════════════════════════════════════════════════════════════════
  { title: 'Batman', category: 'peliculas, accion', type: 'movie' },
  { title: 'Batman Returns', category: 'peliculas, accion', type: 'movie' },
  { title: 'Batman Forever', category: 'peliculas, accion', type: 'movie' },
  { title: 'Batman Begins', category: 'peliculas, accion, drama', type: 'movie' },
  { title: 'The Dark Knight', category: 'peliculas, accion, drama', type: 'movie' },
  { title: 'The Dark Knight Rises', category: 'peliculas, accion, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Alien
  // ═════════════════════════════════════════════════════════════════
  { title: 'Alien', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Aliens', category: 'peliculas, terror, cienciaficcion, accion', type: 'movie' },
  { title: 'Alien³', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Alien: Resurrection', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'AVP: Alien vs. Predator', category: 'peliculas, terror, cienciaficcion, accion', type: 'movie' },
  { title: 'Aliens vs. Predator: Requiem', category: 'peliculas, terror, cienciaficcion, accion', type: 'movie' },
  { title: 'Alien: Covenant', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Predator
  // ═════════════════════════════════════════════════════════════════
  { title: 'Predator', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'Predator 2', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'Predators', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'The Predator', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'Prey', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Godzilla
  // ═════════════════════════════════════════════════════════════════
  { title: 'Godzilla', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Godzilla: King of the Monsters', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Godzilla vs. Kong', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Godzilla x Kong: The New Empire', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Back to the Future
  // ═════════════════════════════════════════════════════════════════
  { title: 'Back to the Future', category: 'peliculas, cienciaficcion, comedia', type: 'movie' },
  { title: 'Back to the Future Part II', category: 'peliculas, cienciaficcion, comedia', type: 'movie' },
  { title: 'Back to the Future Part III', category: 'peliculas, cienciaficcion, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga John Wick
  // ═════════════════════════════════════════════════════════════════
  { title: 'John Wick', category: 'peliculas, accion', type: 'movie' },
  { title: 'John Wick: Chapter 2', category: 'peliculas, accion', type: 'movie' },
  { title: 'John Wick: Chapter 3 - Parabellum', category: 'peliculas, accion', type: 'movie' },
  { title: 'John Wick: Chapter 4', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga 28 Days Later
  // ═════════════════════════════════════════════════════════════════
  { title: '28 Days Later', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: '28 Weeks Later', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga 300
  // ═════════════════════════════════════════════════════════════════
  { title: '300', category: 'peliculas, drama, accion', type: 'movie' },
  { title: '300: Rise of an Empire', category: 'peliculas, drama, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga 50 First Dates
  // ═════════════════════════════════════════════════════════════════
  { title: '50 First Dates', category: 'peliculas, comedia, drama, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga A Nightmare on Elm Street
  // ═════════════════════════════════════════════════════════════════
  { title: 'A Nightmare on Elm Street', category: 'peliculas, terror', type: 'movie' },
  { title: 'A Nightmare on Elm Street Part 2: Freddy\'s Revenge', category: 'peliculas, terror', type: 'movie' },
  { title: 'A Nightmare on Elm Street 3: Dream Warriors', category: 'peliculas, terror', type: 'movie' },
  { title: 'A Nightmare on Elm Street 4: The Dream Master', category: 'peliculas, terror', type: 'movie' },
  { title: 'A Nightmare on Elm Street 5: The Dream Child', category: 'peliculas, terror', type: 'movie' },
  { title: 'Freddy\'s Dead: The Final Nightmare', category: 'peliculas, terror', type: 'movie' },
  { title: 'Wes Craven\'s New Nightmare', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Alice in Wonderland
  // ═════════════════════════════════════════════════════════════════
  { title: 'Alice Through the Looking Glass', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alice in Wonderland', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alice in Wonderland (2010)', tmdb: 12155, category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Alvin and the Chipmunks
  // ═════════════════════════════════════════════════════════════════
  { title: 'Alvin and the Chipmunks', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alvin and the Chipmunks: The Squeakquel', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alvin and the Chipmunks: Chipwrecked', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Alvin and the Chipmunks: The Road Chip', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Annabelle
  // ═════════════════════════════════════════════════════════════════
  { title: 'Annabelle', category: 'peliculas, terror', type: 'movie' },
  { title: 'Annabelle: Creation', category: 'peliculas, terror', type: 'movie' },
  { title: 'Annabelle Comes Home', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Avatar
  // ═════════════════════════════════════════════════════════════════
  { title: 'Avatar', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Avatar: The Way of Water', category: 'peliculas, cienciaficcion, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Blade
  // ═════════════════════════════════════════════════════════════════
  { title: 'Blade', tmdb: 36647, category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'Blade II', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'Blade: Trinity', category: 'peliculas, terror, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Cheaper by the Dozen
  // ═════════════════════════════════════════════════════════════════
  { title: 'Cheaper by the Dozen', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Cheaper by the Dozen 2', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Clash of the Titans
  // ═════════════════════════════════════════════════════════════════
  { title: 'Clash of the Titans', category: 'peliculas, accion', type: 'movie' },
  { title: 'Wrath of the Titans', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Cloverfield
  // ═════════════════════════════════════════════════════════════════
  { title: 'Cloverfield', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: '10 Cloverfield Lane', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'The Cloverfield Paradox', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Crank
  // ═════════════════════════════════════════════════════════════════
  { title: 'Crank', category: 'peliculas, accion', type: 'movie' },
  { title: 'Crank: High Voltage', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Creed
  // ═════════════════════════════════════════════════════════════════
  { title: 'Creed', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Creed II', category: 'peliculas, drama, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Cube
  // ═════════════════════════════════════════════════════════════════
  { title: 'Cube', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Cube 2: Hypercube', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Cube Zero', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Divergent
  // ═════════════════════════════════════════════════════════════════
  { title: 'Divergent', category: 'peliculas, accion, cienciaficcion, romance', type: 'movie' },
  { title: 'Insurgent', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Allegiant', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Doom
  // ═════════════════════════════════════════════════════════════════
  { title: 'Doom', category: 'peliculas, terror, accion, cienciaficcion', type: 'movie' },
  { title: 'Doom: Annihilation', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Evil Dead
  // ═════════════════════════════════════════════════════════════════
  { title: 'Evil Dead (2013)', category: 'peliculas, terror', type: 'movie' },
  { title: 'Evil Dead II', category: 'peliculas, terror, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Fantastic Beasts
  // ═════════════════════════════════════════════════════════════════
  { title: 'Fantastic Beasts and Where to Find Them', category: 'peliculas', type: 'movie' },
  { title: 'Fantastic Beasts: The Crimes of Grindelwald', category: 'peliculas', type: 'movie' },
  { title: 'Fantastic Beasts: The Secrets of Dumbledore', category: 'peliculas', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Fifty Shades
  // ═════════════════════════════════════════════════════════════════
  { title: 'Fifty Shades Darker', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Fifty Shades of Grey', category: 'peliculas, drama, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Ghostbusters
  // ═════════════════════════════════════════════════════════════════
  { title: 'Ghostbusters', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Ghostbusters II', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Ghostbusters (2016)', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Ghostbusters: Afterlife', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Gremlins
  // ═════════════════════════════════════════════════════════════════
  { title: 'Gremlins', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Gremlins 2: The New Batch', category: 'peliculas, terror, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Grown Ups
  // ═════════════════════════════════════════════════════════════════
  { title: 'Grown Ups', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Grown Ups 2', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Hannibal Lecter
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Silence of the Lambs', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Hannibal', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Red Dragon', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Hannibal Rising', category: 'peliculas, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Hellboy
  // ═════════════════════════════════════════════════════════════════
  { title: 'Hellboy', category: 'peliculas, accion', type: 'movie' },
  { title: 'Hellboy II: The Golden Army', category: 'peliculas, accion', type: 'movie' },
  { title: 'Hellboy (2019)', category: 'peliculas, terror, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Hocus Pocus
  // ═════════════════════════════════════════════════════════════════
  { title: 'Hocus Pocus', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Hocus Pocus 2', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga I Spit on Your Grave
  // ═════════════════════════════════════════════════════════════════
  { title: 'I Spit on Your Grave', category: 'peliculas, terror', type: 'movie' },
  { title: 'I Spit on Your Grave 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'I Spit on Your Grave III: Vengeance is Mine', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga IT
  // ═════════════════════════════════════════════════════════════════
  { title: 'It', category: 'peliculas, terror', type: 'movie' },
  { title: 'It Chapter Two', category: 'peliculas, terror', type: 'movie' },
  { title: 'It (1990)', tmdb: 19614, category: 'series, terror', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Independence Day
  // ═════════════════════════════════════════════════════════════════
  { title: 'Independence Day', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Independence Day: Resurgence', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Insidious
  // ═════════════════════════════════════════════════════════════════
  { title: 'Insidious', category: 'peliculas, terror', type: 'movie' },
  { title: 'Insidious: Chapter 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Insidious: The Red Door', category: 'peliculas, terror', type: 'movie' },
  { title: 'Insidious: Chapter 3', category: 'peliculas, terror', type: 'movie' },
  { title: 'Insidious: The Last Key', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Jason Bourne
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Bourne Identity', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Bourne Supremacy', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Bourne Ultimatum', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Bourne Legacy', category: 'peliculas, accion', type: 'movie' },
  { title: 'Jason Bourne', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Jeepers Creepers
  // ═════════════════════════════════════════════════════════════════
  { title: 'Jeepers Creepers', category: 'peliculas, terror', type: 'movie' },
  { title: 'Jeepers Creepers 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Jeepers Creepers 3', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Joker
  // ═════════════════════════════════════════════════════════════════
  { title: 'Joker: Folie à Deux', category: 'peliculas, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga King Kong
  // ═════════════════════════════════════════════════════════════════
  { title: 'King Kong', category: 'peliculas, drama', type: 'movie' },
  { title: 'Kong: Skull Island', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Leprechaun
  // ═════════════════════════════════════════════════════════════════
  { title: 'Leprechaun', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Leprechaun 2', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Leprechaun 4: In Space', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Leprechaun Returns', category: 'peliculas, terror, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Men in Black
  // ═════════════════════════════════════════════════════════════════
  { title: 'Men in Black', category: 'peliculas, comedia, accion, cienciaficcion', type: 'movie' },
  { title: 'Men in Black II', category: 'peliculas, comedia, accion, cienciaficcion', type: 'movie' },
  { title: 'Men in Black 3', category: 'peliculas, comedia, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga National Treasure
  // ═════════════════════════════════════════════════════════════════
  { title: 'National Treasure', category: 'peliculas, accion', type: 'movie' },
  { title: 'National Treasure: Book of Secrets', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Nobody Sleeps in the Woods Tonight
  // ═════════════════════════════════════════════════════════════════
  { title: 'Nobody Sleeps in the Woods Tonight', category: 'peliculas, terror', type: 'movie' },
  { title: 'Nobody Sleeps in the Woods Tonight 2', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Paranormal Activity
  // ═════════════════════════════════════════════════════════════════
  { title: 'Paranormal Activity', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity 3', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity 4', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity: The Marked Ones', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity: The Ghost Dimension', category: 'peliculas, terror', type: 'movie' },
  { title: 'Paranormal Activity: Next of Kin', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Paul Blart
  // ═════════════════════════════════════════════════════════════════
  { title: 'Paul Blart: Mall Cop', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Paul Blart: Mall Cop 2', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Pitch Perfect
  // ═════════════════════════════════════════════════════════════════
  { title: 'Pitch Perfect', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Pitch Perfect 2', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Pitch Perfect 3', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Scary Movie
  // ═════════════════════════════════════════════════════════════════
  { title: 'Scary Movie', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Scary Movie 2', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Scary Movie 3', category: 'peliculas, terror, comedia', type: 'movie' },
  { title: 'Scary Movie 4', category: 'peliculas, terror, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Sherlock Holmes
  // ═════════════════════════════════════════════════════════════════
  { title: 'Sherlock Holmes: A Game of Shadows', category: 'peliculas, accion', type: 'movie' },
  { title: 'Sherlock Holmes', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Silent Hill
  // ═════════════════════════════════════════════════════════════════
  { title: 'Silent Hill', category: 'peliculas, terror', type: 'movie' },
  { title: 'Silent Hill: Revelation', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Sinister
  // ═════════════════════════════════════════════════════════════════
  { title: 'Sinister', category: 'peliculas, terror', type: 'movie' },
  { title: 'Sinister 2', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Sonic the Hedgehog
  // ═════════════════════════════════════════════════════════════════
  { title: 'Sonic the Hedgehog 3', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Sonic the Hedgehog', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Species
  // ═════════════════════════════════════════════════════════════════
  { title: 'Species', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Species II', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Species III', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Species: The Awakening', category: 'peliculas, terror, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Spider-Man (Raimi)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Spider-Man', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Spider-Man 2', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Spider-Man 3', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Spy Kids
  // ═════════════════════════════════════════════════════════════════
  { title: 'Spy Kids', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Spy Kids 2: Island of Lost Dreams', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Spy Kids 3-D: Game Over', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Spy Kids: All the Time in the World', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Star Trek
  // ═════════════════════════════════════════════════════════════════
  { title: 'Star Trek: The Motion Picture', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek: Nemesis', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek II: The Wrath of Khan', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek III: The Search for Spock', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek IV: The Voyage Home', category: 'peliculas, comedia, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek V: The Final Frontier', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek VI: The Undiscovered Country', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek: Generations', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek: First Contact', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek: Insurrection', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Star Trek Into Darkness', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'For the Love of Spock', category: 'peliculas, documental', type: 'movie' },
  { title: 'Star Trek Beyond', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Tall Girl
  // ═════════════════════════════════════════════════════════════════
  { title: 'Tall Girl', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Tall Girl 2', category: 'peliculas, comedia, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Amazing Spider-Man
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Amazing Spider-Man', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'The Amazing Spider-Man 2', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Blair Witch Project
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Blair Witch Project', category: 'peliculas, terror', type: 'movie' },
  { title: 'Book of Shadows: Blair Witch 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Blair Witch', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Conjuring
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Conjuring', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Conjuring 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Conjuring: Last Rites', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Exorcist
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Exorcist', category: 'peliculas, terror', type: 'movie' },
  { title: 'Exorcist II: The Heretic', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Exorcist III', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Godfather
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Godfather', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Godfather Part II', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Godfather Part III', category: 'peliculas, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Hangover
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Hangover', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Hangover Part II', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Hangover Part III', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Kissing Booth
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Kissing Booth', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'The Kissing Booth 2', category: 'peliculas, comedia, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Nun
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Nun', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Nun II', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Ring
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Ring', tmdb: 565, category: 'peliculas, terror', type: 'movie' },
  { title: 'The Ring Two', category: 'peliculas, terror', type: 'movie' },
  { title: 'Rings', tmdb: 14564, category: 'peliculas, terror', type: 'movie' },
  { title: 'Ringu', tmdb: 2671, category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Texas Chainsaw Massacre
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Texas Chain Saw Massacre', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Texas Chainsaw Massacre', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Texas Chainsaw Massacre: The Beginning', category: 'peliculas, terror', type: 'movie' },
  { title: 'Texas Chainsaw 3D', category: 'peliculas, terror', type: 'movie' },
  { title: 'Leatherface', category: 'peliculas, terror', type: 'movie' },
  { title: 'Texas Chainsaw Massacre (2022)', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Transporter
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Transporter', category: 'peliculas, accion', type: 'movie' },
  { title: 'Transporter 2', category: 'peliculas, accion', type: 'movie' },
  { title: 'Transporter 3', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Transporter Refueled', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga To All the Boys
  // ═════════════════════════════════════════════════════════════════
  { title: 'To All the Boys I\'ve Loved Before', category: 'peliculas, comedia, drama, romance', type: 'movie' },
  { title: 'To All the Boys: P.S. I Still Love You', category: 'peliculas, comedia, drama, romance', type: 'movie' },
  { title: 'To All the Boys: Always and Forever', category: 'peliculas, comedia, drama, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Top Gun
  // ═════════════════════════════════════════════════════════════════
  { title: 'Top Gun: Maverick', category: 'peliculas, accion, drama', type: 'movie' },
  { title: 'Top Gun', category: 'peliculas, drama, accion, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Twilight
  // ═════════════════════════════════════════════════════════════════
  { title: 'Twilight', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'The Twilight Saga: New Moon', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'The Twilight Saga: Eclipse', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'The Twilight Saga: Breaking Dawn - Part 1', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'The Twilight Saga: Breaking Dawn - Part 2', category: 'peliculas, drama, romance', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Unbreakable
  // ═════════════════════════════════════════════════════════════════
  { title: 'Unbreakable', category: 'peliculas, drama', type: 'movie' },
  { title: 'Split', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Glass', category: 'peliculas, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Zombieland
  // ═════════════════════════════════════════════════════════════════
  { title: 'Zombieland', category: 'peliculas, terror, comedia, accion', type: 'movie' },
  { title: 'Zombieland: Double Tap', category: 'peliculas, terror, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga [REC]
  // ═════════════════════════════════════════════════════════════════
  { title: '[REC]', category: 'peliculas, terror', type: 'movie' },
  { title: '[REC] 2', tmdb: 10664, category: 'peliculas, terror', type: 'movie' },
  { title: '[REC] 3: Genesis', category: 'peliculas, terror, comedia', type: 'movie' },









  // ═══════════════════════════════════════════════════════════════════
// NUEVAS ENTRADAS PARA CATALOG_DATA — BankaiPlus
// Generado para agregar antes del cierre "];" del archivo catalog-data.js
// Verificado contra TMDB / fuentes oficiales (julio 2026)
// ═══════════════════════════════════════════════════════════════════

  // ═════════════════════════════════════════════════════════════════
  // SERIES (nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Berlin', category: 'series, accion, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Spider-Noir', category: 'series, accion, drama', type: 'tv', seasons: '1' },
  { title: 'The Walking Dead: Dead City', category: 'series, terror, drama, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Dexter: Resurrection', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Loki', category: 'series, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'The Penguin', category: 'series, drama, accion', type: 'tv', seasons: '1' },
  { title: 'The 100', category: 'series, cienciaficcion, drama, accion', type: 'tv', seasons: '1 a 7' },
  { title: 'Yo soy Betty la fea', category: 'series, comedia, drama, romance', type: 'tv', seasons: '1' },
  { title: 'Star Wars: Skeleton Crew', category: 'series, cienciaficcion, accion', type: 'tv', seasons: '1' },
  { title: 'Mr. Bean', category: 'series, comedia', type: 'tv', seasons: '1' },
  { title: 'The Midnight Gospel', category: 'series, comedia, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'The Queen\'s Gambit', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Widow\'s Bay', category: 'series, terror, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'From', category: 'series, terror, cienciaficcion, drama', type: 'tv', seasons: '1 a 4' },
  { title: 'Dune: Prophecy', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Drake & Josh', category: 'series, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Common Side Effects', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Little Demon', category: 'series, comedia, terror', type: 'tv', seasons: '1' },
  { title: 'Mr. Pickles', category: 'series, comedia, terror', type: 'tv', seasons: '1 a 3' },
  { title: 'Pantheon', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Among Us', category: 'series, comedia, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Arcane', category: 'series, accion, cienciaficcion, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Las Perrerías de Mike', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Avatar: The Last Airbender', category: 'infantil, accion, cienciaficcion, drama', type: 'tv', seasons: '1 a 3' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME (series, nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'My Hero Academia: Vigilantes', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Dororo', category: 'anime, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Devil May Cry: The Animated Series', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Devil May Cry', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Solo Leveling', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'The Amazing Digital Circus', category: 'series, comedia, terror', type: 'tv', seasons: '1' },
  { title: 'Bleach: Thousand-Year Blood War', tmdb: 30984, category: 'anime, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Ergo Proxy', category: 'anime, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Hajime no Ippo', category: 'anime, drama, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Blade of the Immortal', category: 'anime, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Castlevania', category: 'anime, accion, terror', type: 'tv', seasons: '1 a 4' },
  { title: 'Karakuri Circus', category: 'anime, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Monster Rancher', category: 'anime, accion, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Pokémon', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Rick and Morty: The Anime', category: 'anime, comedia, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Tower of God', category: 'anime, accion, drama', type: 'tv', seasons: '1 a 2' },
  { title: 'Digimon Adventure 01', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Digimon Tamers', category: 'anime, accion, drama', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME - Películas (nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Seven Deadly Sins: Cursed by Light', category: 'anime, accion', type: 'movie' },
  { title: 'The Seven Deadly Sins: Grudge of Edinburgh Part 1', category: 'anime, accion', type: 'movie' },
  { title: 'Evangelion: 1.0 You Are (Not) Alone', category: 'anime, cienciaficcion, drama, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // ESTUDIO GHIBLI (películas, nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Castle in the Sky', category: 'anime, cienciaficcion, accion', type: 'movie' },
  { title: 'The Tale of the Princess Kaguya', category: 'anime, drama', type: 'movie' },
  { title: 'Howl\'s Moving Castle', category: 'anime, cienciaficcion, romance', type: 'movie' },
  { title: 'The Secret World of Arrietty', category: 'anime, drama', type: 'movie' },
  { title: 'When Marnie Was There', category: 'anime, drama', type: 'movie' },
  { title: 'Spirited Away', category: 'anime, cienciaficcion, drama', type: 'movie' },
  { title: 'Kiki\'s Delivery Service', category: 'anime, comedia, drama', type: 'movie' },
  { title: 'Pom Poko', category: 'anime, comedia, drama', type: 'movie' },
  { title: 'Princess Mononoke', category: 'anime, accion, drama', type: 'movie' },
  { title: 'Grave of the Fireflies', category: 'anime, drama', type: 'movie' },
  { title: 'Mi vecino Totoro', category: 'anime, drama', type: 'movie' },
  { title: 'Mis vecinos los Yamada', category: 'anime, comedia', type: 'movie' },
  { title: 'Nausicaä of the Valley of the Wind', category: 'anime, cienciaficcion, drama, accion', type: 'movie' },
  { title: 'Ponyo', category: 'anime, drama', type: 'movie' },
  { title: 'Porco Rosso', category: 'anime, comedia, accion', type: 'movie' },
  { title: 'Only Yesterday', category: 'anime, drama, romance', type: 'movie' },
  { title: 'The Wind Rises', category: 'anime, drama', type: 'movie' },
  { title: 'Whisper of the Heart', category: 'anime, drama, romance', type: 'movie' },
  { title: 'The Boy and the Heron', category: 'anime, drama, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES - Series (nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Dragon Striker', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Iwájú', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Jurassic World: Camp Cretaceous', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1 a 5' },
  { title: 'Jurassic World: Chaos Theory', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'The Owl House', category: 'infantil, comedia, cienciaficcion', type: 'tv', seasons: '1 a 3' },
  { title: 'Las Leyendas', category: 'infantil, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Las Leyendas: Creaturas Ocultas', category: 'infantil, terror, comedia', type: 'tv', seasons: '1' },
  { title: 'LOL Surprise! House of Surprises', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Maya and the Three', category: 'infantil, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Monster High', category: 'infantil, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Oni: Thunder God\'s Tale', category: 'infantil, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Pocoyo', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'The Penguins of Madagascar', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'The Cuphead Show!', category: 'infantil, comedia, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Dragons: The Nine Realms', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'The Spectacular Spider-Man', category: 'infantil, accion', type: 'tv', seasons: '1 a 2' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Individuales (nuevas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Tron: Legacy', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Morbius', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'San Andreas', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Shining', category: 'peliculas, terror', type: 'movie' },
  { title: 'Dune', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'Dune: Part Two', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'Avatar: Fire and Ash', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Pacifier', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Deadpool', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Deadpool 2', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Guardians of the Galaxy Vol. 3', category: 'peliculas, accion, comedia, cienciaficcion', type: 'movie' },
  { title: 'Beetlejuice', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'Charlie and the Chocolate Factory', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Ed Wood', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Corpse Bride', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'Big Fish', category: 'peliculas, drama, comedia', type: 'movie' },
  { title: 'Planet of the Apes', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Pee-wee\'s Big Adventure', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Mars Attacks!', category: 'peliculas, comedia, cienciaficcion', type: 'movie' },
  { title: 'Big Eyes', category: 'peliculas, drama', type: 'movie' },
  { title: 'Dark Shadows', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'Sweeney Todd: The Demon Barber of Fleet Street', category: 'peliculas, drama, terror', type: 'movie' },
  { title: 'Night at the Museum', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Night at the Museum: Battle of the Smithsonian', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Night at the Museum: Secret of the Tomb', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Naked Gun: From the Files of Police Squad!', category: 'peliculas, comedia', type: 'movie' },
  { title: 'The Naked Gun 2½: The Smell of Fear', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Naked Gun 33⅓: The Final Insult', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Hereditary', category: 'peliculas, terror', type: 'movie' },
  { title: 'Terrifier', category: 'peliculas, terror', type: 'movie' },
  { title: 'Terrifier 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Terrifier 3', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Final Destination
  // ═════════════════════════════════════════════════════════════════
  { title: 'Final Destination', category: 'peliculas, terror', type: 'movie' },
  { title: 'Final Destination 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Final Destination 3', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Final Destination', category: 'peliculas, terror', type: 'movie' },
  { title: 'Final Destination 5', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Big Momma's House (Mi abuela es un peligro)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Big Momma\'s House', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Big Momma\'s House 2', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Big Momma\'s House: Like Father, Like Son', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Home Alone (Mi pobre angelito)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Home Alone', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Home Alone 2: Lost in New York', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Home Alone 3', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Home Alone 4: Taking Back the House', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Home Alone: The Holiday Heist', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Home Sweet Home Alone', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Mad Max
  // ═════════════════════════════════════════════════════════════════
  { title: 'Mad Max', tmdb: 9659, category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Mad Max 2: The Road Warrior', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Mad Max Beyond Thunderdome', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Mad Max: Fury Road', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Furiosa: A Mad Max Saga', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Maleficent
  // ═════════════════════════════════════════════════════════════════
  { title: 'Maleficent', category: 'infantil, accion, drama', type: 'movie' },
  { title: 'Maleficent: Mistress of Evil', category: 'infantil, accion, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Bad Boys
  // ═════════════════════════════════════════════════════════════════
  { title: 'Bad Boys', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Bad Boys II', category: 'peliculas, accion, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Beauty and the Beast
  // ═════════════════════════════════════════════════════════════════
  { title: 'Beauty and the Beast (1991)', category: 'infantil, romance, drama', type: 'movie' },
  { title: 'Beauty and the Beast: The Enchanted Christmas', category: 'infantil, romance, comedia', type: 'movie' },
  { title: 'Belle\'s Magical World', category: 'infantil, romance, comedia', type: 'movie' },
  { title: 'Beauty and the Beast', category: 'peliculas, romance, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Lilo & Stitch
  // ═════════════════════════════════════════════════════════════════
  { title: 'Lilo & Stitch 2: Stitch Has a Glitch', category: 'infantil, comedia, cienciaficcion', type: 'movie' },
  { title: 'Leroy & Stitch', category: 'infantil, comedia, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Hunger Games
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Hunger Games', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'The Hunger Games: Catching Fire', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'The Hunger Games: Mockingjay Part 1', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'The Hunger Games: Mockingjay Part 2', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },
  { title: 'The Hunger Games: The Ballad of Songbirds and Snakes', category: 'peliculas, cienciaficcion, accion, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Mulan
  // ═════════════════════════════════════════════════════════════════
  { title: 'Mulan', category: 'infantil, accion, drama', type: 'movie' },
  { title: 'Mulan II', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Mulan (2020)', category: 'peliculas, accion, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Pinocchio
  // ═════════════════════════════════════════════════════════════════
  { title: 'Pinocchio', category: 'infantil, drama', type: 'movie' },
  { title: 'Pinocho de Guillermo del Toro', category: 'peliculas, drama, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES - Películas (nuevas, individuales)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Sonic the Hedgehog 2', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Raya and the Last Dragon', category: 'infantil, accion, drama', type: 'movie' },
  { title: 'A Bug\'s Life', category: 'infantil, comedia', type: 'movie' },
  { title: 'Snow White and the Seven Dwarfs', category: 'infantil, drama', type: 'movie' },
  { title: 'Bolt', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'Finding Dory', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Finding Nemo', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'The Black Cauldron', category: 'infantil, cienciaficcion, accion', type: 'movie' },
  { title: 'The Fox and the Hound', category: 'infantil, drama', type: 'movie' },
  { title: 'The Fox and the Hound 2', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Elemental', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'A Goofy Movie', category: 'infantil, comedia', type: 'movie' },
  { title: 'An Extremely Goofy Movie', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Sword in the Stone', category: 'infantil, comedia', type: 'movie' },
  { title: 'One Hundred and One Dalmatians', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Princess and the Frog', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'The Many Adventures of Winnie the Pooh', category: 'infantil, comedia', type: 'movie' },
  { title: 'The Incredibles', category: 'infantil, accion, comedia', type: 'movie' },
  { title: 'Incredibles 2', category: 'infantil, accion, comedia', type: 'movie' },
  { title: 'Luca', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'DuckTales the Movie: Treasure of the Lost Lamp', category: 'infantil, accion, comedia', type: 'movie' },
  { title: 'Oliver & Company', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Peter Pan', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'The Great Mouse Detective', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'Turning Red', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Robin Hood', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'Brother Bear', category: 'infantil, drama, accion', type: 'movie' },
  { title: 'Brother Bear 2', category: 'infantil, drama, comedia', type: 'movie' },
  { title: 'Up', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'The Wild', tmdb: 9904, category: 'infantil, comedia', type: 'movie' },
  { title: 'Wish', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Winnie the Pooh', category: 'infantil, comedia', type: 'movie' },
  { title: 'Zootopia', category: 'infantil, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — SERIES
  // ═════════════════════════════════════════════════════════════════
  { title: 'Batman Beyond', category: 'series, accion, cienciaficcion', type: 'tv', seasons: '1 a 3' },
  { title: 'The Legend of Vox Machina', category: 'series, accion, cienciaficcion, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Robin Hood', category: 'series, drama, accion, romance', type: 'tv', seasons: '1' },
  { title: 'The IT Crowd', category: 'series, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'The OA', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'Mr. Robot', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1 a 4' },
  { title: 'Cobra Kai', category: 'series, accion, drama, comedia', type: 'tv', seasons: '1 a 6' },
  { title: 'Peacemaker', category: 'series, accion, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Monster: The Ed Gein Story', category: 'series, drama, terror', type: 'tv', seasons: '1' },
  { title: 'Alien: Earth', category: 'series, terror, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'A Knight of the Seven Kingdoms: The Hedge Knight', category: 'series, drama, accion', type: 'tv', seasons: '1' },
  { title: 'Ragnarok', category: 'series, cienciaficcion, drama, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Adolescence', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'It: Welcome to Derry', category: 'series, terror, drama', type: 'tv', seasons: '1' },
  { title: 'Helstrom', category: 'series, accion, terror, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Ju-On: Origins', category: 'series, terror', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — ANIME (series)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Suicide Squad Isekai', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Hell\'s Paradise: Jigokuraku', category: 'anime, accion, terror', type: 'tv', seasons: '1 a 2' },
  { title: 'Kaiju No. 8', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'YuYu Hakusho', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Kimi ni Todoke: From Me to You', category: 'anime, romance, drama, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Rent-a-Girlfriend', category: 'anime, comedia, romance', type: 'tv', seasons: '1 a 4' },
  { title: 'Dragon Ball GT', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Digimon Adventure:', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Digimon Adventure 02', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Digimon Ghost Game', category: 'anime, accion, terror', type: 'tv', seasons: '1' },
  { title: 'Digimon Frontier', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Digimon Beatbreak', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — ANIME (películas)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Digimon Adventure tri.', category: 'anime, accion, drama', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — INFANTILES (series)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Fast & Furious: Spy Racers', category: 'infantil, accion, cienciaficcion', type: 'tv', seasons: '1 a 6' },
  { title: 'Your Friendly Neighborhood Spider-Man', category: 'infantil, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Villainous', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'WondLa', category: 'infantil, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Zootopia+', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Beyblade', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Yu-Gi-Oh!', category: 'anime, accion', type: 'tv', seasons: '1' },
  { title: 'Alvin and the Chipmunks', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },
  { title: 'Recess', category: 'infantil, comedia', type: 'tv', seasons: '1 a 6' },
  { title: 'Rocket Power', category: 'infantil, comedia, accion', type: 'tv', seasons: '1 a 4' },
  { title: 'Curses!', category: 'infantil, comedia, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Baymax!', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Bluey', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Blippi', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Miraculous: Tales of Ladybug & Cat Noir', tmdb: 65334, category: 'infantil, accion, comedia', type: 'tv', seasons: '1 a 5' },
  { title: 'Muppet Babies', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Vampirina', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Spider-Man: The Animated Series', category: 'infantil, accion', type: 'tv', seasons: '1 a 5' },
  { title: 'Goosebumps', category: 'infantil, terror', type: 'tv', seasons: '1 a 4' },
  { title: 'Goosebumps: The Vanishing', category: 'infantil, terror, comedia', type: 'tv', seasons: '1 a 2' },
  { title: 'Are You Afraid of the Dark?', category: 'infantil, terror', type: 'tv', seasons: '1 a 2' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — DOCUMENTALES
  // ═════════════════════════════════════════════════════════════════
  { title: '72 Dangerous Animals', category: 'series, documental', type: 'tv', seasons: '1 a 3' },
  { title: 'Welcome to Earth', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Lost Cities with Albert Lin', category: 'series, documental', type: 'tv', seasons: '1 a 3' },
  { title: 'World War II in Colour', category: 'series, documental', type: 'tv', seasons: '1 a 2' },
  { title: 'Idols del K-pop', category: 'series, documental, drama', type: 'tv', seasons: '1' },
  { title: 'The Enfield Poltergeist', category: 'series, documental, terror', type: 'tv', seasons: '1' },
  { title: 'One Perfect Shot', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'The Secret Lives of Animals', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Conversations with a Killer: The Jeffrey Dahmer Tapes', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Lost Treasures of the Maya', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'My Encounter with Evil', category: 'series, documental, terror', type: 'tv', seasons: '1 a 2' },
  { title: 'National Geographic: Los Ciclos de la Tierra', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Hostile Planet', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Lost Treasures of Egypt', category: 'series, documental', type: 'tv', seasons: '1 a 3' },
  { title: 'Vietnam: The War That Changed America', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'Prehistoric Planet', category: 'series, documental', type: 'tv', seasons: '1 a 2' },
  // VERIFICAR: no se identificó con certeza cuál especial de stand-up de Franco Escamilla corresponde a "auditorio" (tiene varios: "Por la anécdota", "Bienvenido al Mundo", "Voyerista Auditivo"). Se eligió el que más se asocia a presentaciones en el Auditorio Nacional; revisar.
  { title: 'Franco Escamilla: Bienvenido al Mundo', category: 'peliculas, comedia, documental', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — DISNEYNATURE
  // ═════════════════════════════════════════════════════════════════
  { title: 'Disneynature: Wings of Life', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Growing Up Wild', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Chimpanzee', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: The Crimson Wing - Mystery of the Flamingos', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Monkey Kingdom', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Expedition China', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: African Cats', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Ghost of the Mountains', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Born in China', category: 'peliculas, documental', type: 'movie' },
  { title: 'Disneynature: Bears', category: 'peliculas, documental', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — K-DRAMAS / DORAMAS
  // ═════════════════════════════════════════════════════════════════
  { title: 'Alice', category: 'series, cienciaficcion, drama', type: 'tv', seasons: '1' },
  { title: 'Anna', tmdb: 196268, category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Crash Landing on You', category: 'series, romance, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'Bad Guys', category: 'series, accion, drama', type: 'tv', seasons: '1' },
  { title: 'XO, Kitty', category: 'series, comedia, romance', type: 'tv', seasons: '1 a 2' },
  { title: 'Boys Over Flowers', category: 'series, romance, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Chicago Typewriter', category: 'series, drama, romance', type: 'tv', seasons: '1' },
  { title: 'Fishbowl Wives', category: 'series, drama, romance', type: 'tv', seasons: '1' },
  { title: 'Connect', category: 'series, accion, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Dongjae, the Good or the Bastard', category: 'series, drama, accion', type: 'tv', seasons: '1' },
  { title: 'Doona!', category: 'series, romance, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Sweet Home', category: 'series, terror, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Agent from Above', category: 'series, accion, drama', type: 'tv', seasons: '1' },
  { title: 'El juego de la muerte', category: 'series, accion, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'El Juego de la Pirámide', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'The King: Eternal Monarch', category: 'series, drama, romance, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Trolley', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Once Upon a Small Town', category: 'series, romance, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Wait, My Youth', category: 'series, drama, romance, comedia', type: 'tv', seasons: '1' },
  { title: 'Eve', tmdb: 138251, category: 'series, drama, romance', type: 'tv', seasons: '1' },
  { title: 'Heavenly Ever After', category: 'series, drama, romance, comedia', type: 'tv', seasons: '1' },
  { title: 'My ID is Gangnam Beauty', category: 'series, comedia, drama, romance', type: 'tv', seasons: '1' },
  { title: 'The Good Bad Mother', category: 'series, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'La Gloria', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'Forecasting Love and Weather', category: 'series, romance, comedia', type: 'tv', seasons: '1' },
  { title: 'Tomorrow', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'I\'m Not a Robot', category: 'series, comedia, romance', type: 'tv', seasons: '1' },
  { title: 'Nobody Knows', tmdb: 97220, category: 'series, drama, terror', type: 'tv', seasons: '1' },
  { title: 'Only for Love', category: 'series, comedia, romance', type: 'tv', seasons: '1' },
  { title: 'Clean with Passion for Now', category: 'series, comedia, romance', type: 'tv', seasons: '1' },
  { title: 'Payback: Money and Power', category: 'series, drama, accion', type: 'tv', seasons: '1' },
  { title: 'A Business Proposal', category: 'series, comedia, romance', type: 'tv', seasons: '1' },
  { title: 'Reset', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Rugal', category: 'series, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Save Me', category: 'series, drama, terror', type: 'tv', seasons: '1' },
  { title: 'Señor Reina', category: 'series, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'When Life Gives You Tangerines', category: 'series, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'Signal', category: 'series, drama, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Stranger', category: 'series, drama, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Study Group', category: 'series, accion, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'Summer Strike', category: 'series, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'Juvenile Justice', category: 'series, drama', type: 'tv', seasons: '1' },
  { title: 'A Love So Beautiful', category: 'series, romance, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'Twenty-Five Twenty-One', category: 'series, drama, romance', type: 'tv', seasons: '1' },
  { title: 'Voice', category: 'series, accion, drama, terror', type: 'tv', seasons: '1 a 4' },
  { title: 'Weak Hero Class', category: 'series, drama, accion', type: 'tv', seasons: '1' },
  { title: 'Extraordinary Attorney Woo', category: 'series, comedia, drama', type: 'tv', seasons: '1' },
  { title: 'I Will Be Your Bloom', category: 'series, drama, comedia', type: 'tv', seasons: '1' },
  { title: 'Yonder', category: 'series, drama, cienciaficcion, romance', type: 'tv', seasons: '1' },

  // ═════════════════════════════════════════════════════════════════
  // NUEVAS ENTRADAS (segunda tanda) — PELÍCULAS Individuales
  // ═════════════════════════════════════════════════════════════════
  { title: 'Backrooms', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Gladiator II', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Copycat', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Eden', category: 'peliculas, drama', type: 'movie' },
  { title: 'Paradox Effect', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Count of Monte Cristo', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'The Fourth Kind', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'Eternity', category: 'peliculas, comedia, drama, romance', type: 'movie' },
  { title: 'Evil Dead Rise', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Penguin Lessons', category: 'peliculas, drama, comedia', type: 'movie' },
  { title: 'My Penguin Friend', category: 'peliculas, drama', type: 'movie' },
  { title: 'Together', category: 'peliculas, terror', type: 'movie' },
  { title: 'V/H/S/Halloween', category: 'peliculas, terror', type: 'movie' },
  { title: 'Zoopocalypse', category: 'infantil, comedia', type: 'movie' },
  { title: 'ParaNorman', category: 'infantil, terror, comedia', type: 'movie' },
  { title: 'Constantine', category: 'peliculas, accion, terror, cienciaficcion', type: 'movie' },
  { title: 'Elysium', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'Inside Out', category: 'infantil, comedia, drama', type: 'movie' },
  { title: 'Disclosure Day', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Eternals', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Dungeons & Dragons: Honor Among Thieves', category: 'peliculas, accion, comedia, cienciaficcion', type: 'movie' },
  { title: 'F1', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'Five Nights at Freddy\'s', category: 'peliculas, terror', type: 'movie' },
  { title: 'Fly Me to the Moon', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Finch', category: 'peliculas, drama, cienciaficcion', type: 'movie' },
  { title: 'Wolf Man', category: 'peliculas, terror', type: 'movie' },
  { title: 'Kraven the Hunter', category: 'peliculas, accion', type: 'movie' },
  { title: 'Lightyear', category: 'infantil, cienciaficcion, accion', type: 'movie' },
  { title: 'Migration', category: 'infantil, comedia', type: 'movie' },
  { title: 'Mufasa: The Lion King', category: 'infantil, drama, accion', type: 'movie' },
  { title: 'Moonfall', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Nosferatu', category: 'peliculas, terror', type: 'movie' },
  { title: 'Novocaine', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Puss in Boots: The Last Wish', category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'Radical', category: 'peliculas, drama', type: 'movie' },
  { title: 'Robot Dreams', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Saw X', category: 'peliculas, terror', type: 'movie' },
  { title: 'Smile', category: 'peliculas, terror', type: 'movie' },
  { title: 'Smile 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Spirited', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Talk to Me', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Black Phone', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Batman', category: 'peliculas, accion, drama', type: 'movie' },
  { title: 'The Boogeyman', category: 'peliculas, terror', type: 'movie' },
  { title: 'Ghostbusters: Frozen Empire', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'The Exorcist: Believer', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Creator', category: 'peliculas, cienciaficcion, accion', type: 'movie' },
  { title: 'The Flash', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'The Marvels', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'The Northman', category: 'peliculas, drama, accion', type: 'movie' },
  { title: 'The Pope\'s Exorcist', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Ritual Killer', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'The Substance', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'The Whale', category: 'peliculas, drama', type: 'movie' },
  { title: 'Transformers: Rise of the Beasts', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Wonka', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Uncharted', category: 'peliculas, accion', type: 'movie' },
  { title: 'Cruella', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Army of the Dead', category: 'peliculas, terror, accion', type: 'movie' },
  { title: 'Monster Hunter', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Vanquish', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Watchers', category: 'peliculas, terror', type: 'movie' },
  { title: 'Robots', category: 'infantil, comedia, cienciaficcion', type: 'movie' },
  { title: 'I Am Legend', category: 'peliculas, drama, cienciaficcion, accion', type: 'movie' },
  { title: 'Star Wars: The Mandalorian and Grogu', category: 'peliculas, cienciaficcion, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Ice Age
  // ═════════════════════════════════════════════════════════════════
  { title: 'Ice Age', category: 'infantil, comedia', type: 'movie' },
  { title: 'Ice Age: The Meltdown', category: 'infantil, comedia', type: 'movie' },
  { title: 'Ice Age: Dawn of the Dinosaurs', category: 'infantil, comedia', type: 'movie' },
  { title: 'Ice Age: Continental Drift', category: 'infantil, comedia', type: 'movie' },
  { title: 'Ice Age: Collision Course', category: 'infantil, comedia, cienciaficcion', type: 'movie' },
  { title: 'Ice Age: Adventures of Buck Wild', category: 'infantil, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Despicable Me
  // ═════════════════════════════════════════════════════════════════
  { title: 'Despicable Me', category: 'infantil, comedia', type: 'movie' },
  { title: 'Despicable Me 2', category: 'infantil, comedia', type: 'movie' },
  { title: 'Despicable Me 3', category: 'infantil, comedia', type: 'movie' },
  { title: 'Minions', category: 'infantil, comedia', type: 'movie' },
  { title: 'Minions: The Rise of Gru', category: 'infantil, comedia', type: 'movie' },
  { title: 'Minions & Monsters', category: 'infantil, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Scream
  // ═════════════════════════════════════════════════════════════════
  { title: 'Scream', category: 'peliculas, terror', type: 'movie' },
  { title: 'Scream 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Scream 3', category: 'peliculas, terror', type: 'movie' },
  { title: 'Scream 4', category: 'peliculas, terror', type: 'movie' },
  { title: 'Scream VI', category: 'peliculas, terror', type: 'movie' },
  { title: 'Scream 7', category: 'peliculas, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Rush Hour (Una pareja explosiva)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Rush Hour', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Rush Hour 2', category: 'peliculas, comedia, accion', type: 'movie' },
  { title: 'Rush Hour 3', category: 'peliculas, comedia, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Space Jam
  // ═════════════════════════════════════════════════════════════════
  { title: 'Space Jam', category: 'infantil, comedia', type: 'movie' },
  { title: 'Space Jam: A New Legacy', category: 'infantil, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Den of Thieves (El robo perfecto)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Den of Thieves', category: 'peliculas, accion', type: 'movie' },
  { title: 'Den of Thieves 2: Pantera', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Diary of a Wimpy Kid (El diario de Greg)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Diary of a Wimpy Kid', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Diary of a Wimpy Kid: Rodrick Rules', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Diary of a Wimpy Kid: Dog Days', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Diary of a Wimpy Kid: The Long Haul', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Venom
  // ═════════════════════════════════════════════════════════════════
  { title: 'Venom', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Venom: Let There Be Carnage', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Happy Gilmore
  // ═════════════════════════════════════════════════════════════════
  { title: 'Happy Gilmore', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Happy Gilmore 2', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Lost Bullet (Bala perdida)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Lost Bullet', category: 'peliculas, accion', type: 'movie' },
  { title: 'Lost Bullet 2', category: 'peliculas, accion', type: 'movie' },
  { title: 'Last Bullet', category: 'peliculas, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Don't Breathe
  // ═════════════════════════════════════════════════════════════════
  { title: 'Don\'t Breathe', category: 'peliculas, terror, accion', type: 'movie' },


  // ═════════════════════════════════════════════════════════════════
  // SERIES (reconciliación catálogo 2026-08)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Negocio letal', category: 'series, accion, drama', type: 'tv', seasons: '1' },
  { title: 'Greatest Events of World War II in Colour', category: 'series, documental', type: 'tv', seasons: '1' },
  { title: 'The Chosen', category: 'series, drama', type: 'tv', seasons: '1 a 3' },
  { title: 'Todd McFarlane\'s Spawn', category: 'series, accion, terror, cienciaficcion', type: 'tv', seasons: '1 a 3' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Individuales (reconciliación catálogo 2026-08)
  // ═════════════════════════════════════════════════════════════════
  { title: '10 Minutes Gone', category: 'peliculas, accion', type: 'movie' },
  { title: '4 Wedding Planners', category: 'peliculas, comedia, romance', type: 'movie' },
  { title: 'Pesadilla en la calle Elm', category: 'peliculas, terror', type: 'movie' },
  { title: 'Afterburn', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'All the Places', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Astronaut: The Last Push', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Blade Runner 2049', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'Coin Heist', category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Death\'s Roulette', category: 'peliculas, drama', type: 'movie' },
  { title: 'Lee Cronin\'s The Mummy', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'See for Me', category: 'peliculas, accion', type: 'movie' },
  { title: 'The Amazing Digital Circus: The Last Act', category: 'peliculas, comedia, terror', type: 'movie' },
  { title: 'The Hills Have Eyes', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Hills Have Eyes 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'The Upside', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'The Wonderful Wizard of Oz', category: 'peliculas', type: 'movie' },
  { title: 'War', tmdb: 10431, category: 'peliculas, accion', type: 'movie' },
  { title: 'Weathering', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Obsession', category: 'peliculas, terror', type: 'movie' },
  { title: 'Ice Age: A Mammoth Christmas', category: 'peliculas, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME (reconciliación catálogo 2026-08)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Dragon Ball Z: Dead Zone', category: 'anime, accion', type: 'movie' },
  { title: 'Dragon Ball Z: The History of Trunks', category: 'anime, accion, drama', type: 'movie' },
  { title: 'Dragon Ball Z: The Tree of Might', category: 'anime, accion', type: 'movie' },
  { title: 'My Hero Academia: You\'re Next', category: 'anime, accion', type: 'movie' },
  { title: 'Saint Seiya: Evil Goddess Eris', category: 'anime, accion', type: 'movie' },
  { title: 'The Seven Deadly Sins: Four Knights of the Apocalypse', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Ghost Stories', category: 'anime, terror, comedia', type: 'tv', seasons: '1' },
  { title: 'The Fable', tmdb: 238843, category: 'anime, accion, comedia', type: 'tv', seasons: '1 a 2' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES (reconciliación catálogo 2026-08)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Cars on the Road', category: 'infantil, comedia', type: 'tv', seasons: '1' },
  { title: 'Kung Fu Panda: The Dragon Knight', category: 'infantil, comedia, accion', type: 'tv', seasons: '1 a 3' },
  { title: 'Penguins of Madagascar', category: 'infantil, comedia', type: 'movie' },
  { title: 'Secret Magic Control Agency', tmdb: 797394, category: 'infantil, comedia, accion', type: 'movie' },
  { title: 'The Nightmare Room', category: 'infantil, terror', type: 'tv', seasons: '1' },
  { title: 'Two Tails', category: 'infantil, comedia', type: 'movie' },
  { title: 'Summer Camp Island', category: 'infantil, comedia', type: 'tv', seasons: '1 a 6' },

  // ═════════════════════════════════════════════════════════════════
  // INFANTILES (alta 2026-08-27)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Gravity Falls', category: 'infantil, comedia, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'What\'s New, Scooby-Doo?', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: 'Masters of the Universe', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Oggy and the Cockroaches', category: 'infantil, comedia', type: 'tv', seasons: '1 a 3' },
  { title: '31 Minutos', category: 'infantil, comedia', type: 'tv', seasons: '1 a 4' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME (alta 2026-08-27)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Baki the Grappler', category: 'anime, accion', type: 'tv', seasons: '1 a 2' },
  { title: 'Tojima Wants to Be a Kamen Rider', category: 'anime, accion, comedia', type: 'tv', seasons: '1' },
  { title: 'Gantz', category: 'anime, accion, terror, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'Lord of Mysteries', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Super Cube', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Zoids', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1 a 2' },
  { title: 'Zoids: New Century Zero', category: 'anime, accion, cienciaficcion', type: 'tv', seasons: '1' },
  { title: 'Hell Girl', category: 'anime, terror, drama', type: 'tv', seasons: '1 a 4' },

  // ═════════════════════════════════════════════════════════════════
  // ANIME - Películas (alta 2026-08-27)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Kaiju No. 8: Mission Recon', category: 'anime, accion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Individuales (alta 2026-08-27)
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Fable (2019)', tmdb: 532267, category: 'peliculas, accion, comedia', type: 'movie' },
  { title: 'Oppenheimer', category: 'peliculas, drama', type: 'movie' },
  { title: 'Antichrist', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Bohemian Rhapsody', category: 'peliculas, drama', type: 'movie' },
  { title: 'Donnie Darko', category: 'peliculas, drama, cienciaficcion, terror', type: 'movie' },
  { title: 'Dragonheart: Vengeance', category: 'peliculas, accion', type: 'movie' },
  { title: 'Spaceman', category: 'peliculas, cienciaficcion, drama', type: 'movie' },
  { title: 'The Prestige', category: 'peliculas, drama, cienciaficcion', type: 'movie' },
  { title: 'Bicentennial Man', category: 'peliculas, drama, cienciaficcion', type: 'movie' },
  { title: 'The Passion of the Christ', category: 'peliculas, drama', type: 'movie' },
  { title: 'The Intouchables', tmdb: 77338, category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Pan\'s Labyrinth', category: 'peliculas, drama, terror', type: 'movie' },
  { title: 'The Menu', category: 'peliculas, terror, comedia, drama', type: 'movie' },
  { title: 'That\'s My Boy', category: 'peliculas, comedia', type: 'movie' },
  { title: 'Forrest Gump', category: 'peliculas, drama, romance', type: 'movie' },
  { title: 'Memoir of a Snail', category: 'peliculas, drama, comedia', type: 'movie' },
  { title: 'Her', category: 'peliculas, drama, romance, cienciaficcion', type: 'movie' },
  { title: 'The Green Mile', category: 'peliculas, drama', type: 'movie' },
  { title: 'Black Phone 2', category: 'peliculas, terror', type: 'movie' },
  { title: 'Exit 8', category: 'peliculas, terror, cienciaficcion', type: 'movie' },
  { title: 'The Shape of Water', category: 'peliculas, drama, romance, cienciaficcion', type: 'movie' },
  { title: 'Midsommar', category: 'peliculas, terror, drama', type: 'movie' },
  { title: 'Fear and Loathing in Las Vegas', category: 'peliculas, comedia, drama', type: 'movie' },
  { title: 'Requiem for a Dream', category: 'peliculas, drama', type: 'movie' },
  { title: 'A Poet', tmdb: 1465563, category: 'peliculas, drama, comedia', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Underworld (Inframundo)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Underworld', category: 'peliculas, accion, terror', type: 'movie' },
  { title: 'Underworld: Evolution', category: 'peliculas, accion, terror', type: 'movie' },
  { title: 'Underworld: Rise of the Lycans', category: 'peliculas, accion, terror', type: 'movie' },
  { title: 'Underworld: Awakening', category: 'peliculas, accion, terror', type: 'movie' },
  { title: 'Underworld: Blood Wars', category: 'peliculas, accion, terror', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga Starship Troopers
  // ═════════════════════════════════════════════════════════════════
  { title: 'Starship Troopers', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Starship Troopers 2: Hero of the Federation', category: 'peliculas, accion, cienciaficcion, terror', type: 'movie' },
  { title: 'Starship Troopers 3: Marauder', category: 'peliculas, accion, cienciaficcion', type: 'movie' },
  { title: 'Starship Troopers: Invasion', category: 'peliculas, accion, cienciaficcion', type: 'movie' },

  // ═════════════════════════════════════════════════════════════════
  // PELÍCULAS - Saga The Platform (El Hoyo)
  // ═════════════════════════════════════════════════════════════════
  { title: 'The Platform', category: 'peliculas, terror, cienciaficcion, drama', type: 'movie' },
  { title: 'The Platform 2', category: 'peliculas, terror, cienciaficcion, drama', type: 'movie' },


  // ═════════════════════════════════════════════════════════════════
  // RECONCILIACIÓN EXCEL ↔ CATÁLOGO (2026-08-27)
  // ═════════════════════════════════════════════════════════════════
  { title: 'Lilo & Stitch (2025)', tmdb: 552524, category: 'peliculas, comedia, cienciaficcion', type: 'movie' },
  { title: 'Stitch! The Movie', category: 'infantil, comedia, cienciaficcion', type: 'movie' },
  { title: 'Pinocchio (2022)', tmdb: 532639, category: 'peliculas, drama', type: 'movie' },
  { title: 'Obi-Wan Kenobi: A Jedi\'s Return', category: 'peliculas, documental', type: 'movie' },
  { title: 'Berlín y la dama del armiño', category: 'series, documental', type: 'tv', seasons: '1' },

];
