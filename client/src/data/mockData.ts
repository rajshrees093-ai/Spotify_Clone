import { Song, Artist, Album, Playlist } from '../types';

export const DEMO_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    name: 'Sia',
    bio: 'Australian singer, songwriter, music video director and record producer. Known for chart-topping power ballads and visionary pop concepts.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 68420100,
    verified: true,
    genres: ['Pop', 'Electropop', 'Dance-pop'],
  },
  {
    id: 'art-2',
    name: 'Beyoncé',
    bio: 'A flexible powerhouse singer, songwriter, producer, and dancer. Beyoncé is a multifaceted global superstar by any measure.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 73211512,
    verified: true,
    genres: ['R&B', 'Pop', 'Dance'],
  },
  {
    id: 'art-3',
    name: 'The Weeknd',
    bio: 'Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer-songwriter and record producer known for his sonic versatility and dark lyricism.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 104520930,
    verified: true,
    genres: ['R&B', 'Synth-pop', 'Alternative R&B'],
  },
  {
    id: 'art-4',
    name: 'Daft Punk',
    bio: 'French electronic music duo formed in 1993 in Paris by Thomas Bangalter and Guy-Manuel de Homem-Christo. Pioneers of the French touch synth movement.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 42109840,
    verified: true,
    genres: ['Electronic', 'House', 'Synth-funk'],
  },
  {
    id: 'art-5',
    name: 'Billie Eilish',
    bio: 'American singer and songwriter who first gained public attention in 2015 with her debut single "Ocean Eyes". Known for whisper-pop and genre-bending production.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 88940220,
    verified: true,
    genres: ['Alternative Pop', 'Indie Pop', 'Electropop'],
  },
  {
    id: 'art-6',
    name: 'Arctic Monkeys',
    bio: 'English rock band formed in Sheffield in 2002. One of the first groups to come to prominence via the internet and modern indie rock legends.',
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 54109330,
    verified: true,
    genres: ['Indie Rock', 'Garage Rock', 'Post-Punk Revival'],
  },
  {
    id: 'art-7',
    name: 'Benjamin Francis Leftwich',
    bio: 'English singer-songwriter from York. Known for delicate fingerpicking acoustic guitar and intimate, ethereal vocal storytelling.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 2450800,
    verified: true,
    genres: ['Indie Folk', 'Acoustic', 'Singer-Songwriter'],
  },
  {
    id: 'art-8',
    name: 'Kendrick Lamar',
    bio: 'American rapper, songwriter, and producer. Widely regarded as one of the most influential and accomplished hip-hop artists of his generation.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    monthlyListeners: 71200450,
    verified: true,
    genres: ['Hip-Hop', 'Conscious Hip-Hop', 'West Coast Rap'],
  }
];

export const DEMO_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    title: 'No New Friends',
    artist: 'Sia, Diplo, Labrinth',
    artistId: 'art-1',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2019,
    genre: 'Pop',
    albumType: 'ep',
    songCount: 6,
    duration: 1080
  },
  {
    id: 'alb-2',
    title: 'RENAISSANCE',
    artist: 'Beyoncé',
    artistId: 'art-2',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022,
    genre: 'Dance / House',
    albumType: 'album',
    songCount: 8,
    duration: 1920
  },
  {
    id: 'alb-3',
    title: 'After Hours',
    artist: 'The Weeknd',
    artistId: 'art-3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2020,
    genre: 'Synth-pop',
    albumType: 'album',
    songCount: 7,
    duration: 1650
  },
  {
    id: 'alb-4',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    artistId: 'art-4',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2013,
    genre: 'Electronic',
    albumType: 'album',
    songCount: 6,
    duration: 1540
  },
  {
    id: 'alb-5',
    title: 'AM',
    artist: 'Arctic Monkeys',
    artistId: 'art-6',
    coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2013,
    genre: 'Indie Rock',
    albumType: 'album',
    songCount: 6,
    duration: 1420
  },
  {
    id: 'alb-6',
    title: 'Last Smoke Before the Snowstorm',
    artist: 'Benjamin Francis Leftwich',
    artistId: 'art-7',
    coverUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2011,
    genre: 'Indie Folk',
    albumType: 'album',
    songCount: 5,
    duration: 1100
  }
];

// Audio files: High-reliability royalty-free audio streams
const AUDIO_SAMPLE_1 = 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__Golden_Slumber_Fast.mp3';
const AUDIO_SAMPLE_2 = 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race.ogg';
const AUDIO_SAMPLE_3 = 'https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg';
const AUDIO_SAMPLE_4 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const AUDIO_SAMPLE_5 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
const AUDIO_SAMPLE_6 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
const AUDIO_SAMPLE_7 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';

export const DEMO_SONGS: Song[] = [
  // EP: No New Friends (matches screenshot 2!)
  {
    id: 'song-1',
    title: 'No New Friends',
    artist: 'Sia, Diplo, Labrinth (LSD)',
    artistId: 'art-1',
    album: 'No New Friends',
    albumId: 'alb-1',
    duration: 176, // 2:56
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    genre: 'Pop',
    playsCount: 142890120,
    addedAt: '2023-01-14T10:00:00Z',
    lyrics: `[Verse 1]
We got dreams and we got time
We got phone calls to decline
No new friends, no no new friends
Stay with the ones that were there till the end

[Chorus]
La la la, no new friends
We got all the crew we need
Underneath the summer breeze
No new friends, no no new friends!`
  },
  {
    id: 'song-2',
    title: 'Genius - Lil Wayne Remix',
    artist: 'LSD, Lil Wayne',
    artistId: 'art-1',
    album: 'No New Friends',
    albumId: 'alb-1',
    duration: 163, // 2:43
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    genre: 'Pop',
    playsCount: 89451200,
    addedAt: '2023-01-14T10:05:00Z',
    lyrics: `[Intro]
Do you see the lights?
Only a genius could love a woman like she

[Verse]
Tell me what you think of me
I'm walking on a wire, feel the electricity
Oh you're a genius, can't you see?`
  },
  {
    id: 'song-3',
    title: 'Mountains',
    artist: 'LSD (Labrinth, Sia, Diplo)',
    artistId: 'art-1',
    album: 'No New Friends',
    albumId: 'alb-1',
    duration: 195, // 3:15
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    genre: 'Pop',
    playsCount: 65123900,
    addedAt: '2023-01-14T10:10:00Z',
    lyrics: `[Chorus]
Heavens above, hear my cry
We could move mountains higher than the sky
Stand by my side, we will never fall
We can conquer it all!`
  },
  {
    id: 'song-4',
    title: 'Thunderclouds',
    artist: 'LSD',
    artistId: 'art-1',
    album: 'No New Friends',
    albumId: 'alb-1',
    duration: 187, // 3:07
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    genre: 'Pop',
    playsCount: 231500400,
    addedAt: '2023-01-14T10:15:00Z',
    lyrics: `[Chorus]
All I need is one
One old man is enough
Babe, you got those thunderclouds in your eyes
Don't fear the storm, we will fly!`
  },
  {
    id: 'song-5',
    title: 'Audio',
    artist: 'LSD',
    artistId: 'art-1',
    album: 'No New Friends',
    albumId: 'alb-1',
    duration: 203, // 3:23
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    genre: 'Pop',
    playsCount: 174200800,
    addedAt: '2023-01-14T10:20:00Z',
    lyrics: `[Chorus]
We can't live without the audio
Turn up the radio
Let the beat take control of your soul!`
  },

  // MOVE (Matches screenshot 4!)
  {
    id: 'song-6',
    title: 'MOVE (feat. Grace Jones & Tems)',
    artist: 'Beyoncé, Grace Jones, Tems',
    artistId: 'art-2',
    album: 'RENAISSANCE',
    albumId: 'alb-2',
    duration: 203, // 3:23
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'Dance',
    playsCount: 80050975,
    addedAt: '2022-07-29T12:00:00Z',
    lyrics: `Move out the way, I'm with my girls and we all need space
When the queens come through (queen come through), part like the red sea
Move out the way (how many times) how many times I'ma say it?
It's a home-run when the team touch-base
Brukup, it's brukup, it's brukup (brukup)
Humble like we 'pon the come up (mmh)
Don't make it turn into trouble!`
  },
  {
    id: 'song-7',
    title: 'CUFF IT',
    artist: 'Beyoncé',
    artistId: 'art-2',
    album: 'RENAISSANCE',
    albumId: 'alb-2',
    duration: 225,
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'Disco / Funk',
    playsCount: 450120300,
    addedAt: '2022-07-29T12:05:00Z',
    lyrics: `I feel like fallin' in love
I'm in the mood to fuck somethin' up
Tonight, I'm lettin' go, done with the stress
Put on your finest dress!`
  },
  {
    id: 'song-8',
    title: 'BREAK MY SOUL',
    artist: 'Beyoncé',
    artistId: 'art-2',
    album: 'RENAISSANCE',
    albumId: 'alb-2',
    duration: 278,
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'House',
    playsCount: 390230100,
    addedAt: '2022-07-29T12:10:00Z',
    lyrics: `You won't break my soul
You won't break my soul
Release your anger, release your mind
Release your job, release the time!`
  },

  // Let It In (Matches screenshot 3!)
  {
    id: 'song-9',
    title: 'Let It In',
    artist: 'Dream on Dreamer',
    artistId: 'art-6',
    album: 'It Comes and Goes',
    albumId: 'alb-5',
    duration: 258, // 4:18
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    genre: 'Alternative Rock',
    playsCount: 18450200,
    addedAt: '2020-04-10T08:00:00Z',
    lyrics: `Close your eyes and breathe deep tonight
Let the ocean wash the doubt from your sight
Every mistake was a door to the light
Just let it in, let it in!`
  },

  // Benjamin Francis Leftwich (Matches screenshot 1!)
  {
    id: 'song-10',
    title: 'Pictures',
    artist: 'Benjamin Francis Leftwich',
    artistId: 'art-7',
    album: 'Last Smoke Before the Snowstorm',
    albumId: 'alb-6',
    duration: 177,
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Folk',
    playsCount: 42100800,
    addedAt: '2021-02-14T09:00:00Z',
    lyrics: `Pictures of you on my bedroom floor
Shadows moving underneath the door
I see the sunrise through the cold tree line
Wishing your hand was holding mine.`
  },
  {
    id: 'song-11',
    title: 'Atlas Hands',
    artist: 'Benjamin Francis Leftwich',
    artistId: 'art-7',
    album: 'Last Smoke Before the Snowstorm',
    albumId: 'alb-6',
    duration: 194,
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Folk',
    playsCount: 65200300,
    addedAt: '2021-02-14T09:05:00Z',
    lyrics: `I've got a plan, I've got an atlas in my hands
I'm gonna turn when I reach the river bend
Singing soft words in the open wild
Rest your spirit like a wandering child.`
  },
  {
    id: 'song-12',
    title: 'Gratitude',
    artist: 'Benjamin Francis Leftwich',
    artistId: 'art-7',
    album: 'Last Smoke Before the Snowstorm',
    albumId: 'alb-6',
    duration: 210,
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Folk',
    playsCount: 15400200,
    addedAt: '2021-02-14T09:10:00Z',
    lyrics: `With gratitude in my chest
I leave behind what I loved best
A new dawn rising in the frost
Finding peace in what we lost.`
  },

  // The Weeknd - After Hours
  {
    id: 'song-13',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    artistId: 'art-3',
    album: 'After Hours',
    albumId: 'alb-3',
    duration: 200,
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    genre: 'Synth-pop',
    playsCount: 4120300900,
    addedAt: '2020-03-20T00:00:00Z',
    lyrics: `Yeah, I've been tryna call
I've been on my own for long enough
Maybe you can show me how to love, maybe
I'm going through withdrawals
You don't even have to do too much
You can turn me on with just a touch, baby

Oh, I'm blinded by the lights
No, I can't sleep until I feel your touch!`
  },
  {
    id: 'song-14',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    artistId: 'art-3',
    album: 'After Hours',
    albumId: 'alb-3',
    duration: 215,
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    genre: 'Synth-pop',
    playsCount: 1850400300,
    addedAt: '2020-03-20T00:05:00Z',
    lyrics: `I saw you dancing in a crowded room
You look so happy when I'm not with you
Save your tears for another day!`
  },
  {
    id: 'song-15',
    title: 'In Your Eyes',
    artist: 'The Weeknd',
    artistId: 'art-3',
    album: 'After Hours',
    albumId: 'alb-3',
    duration: 237,
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    genre: 'Synth-pop',
    playsCount: 890200500,
    addedAt: '2020-03-20T00:10:00Z',
    lyrics: `In your eyes, I see there's something burning inside you
Oh, in your eyes, I try to find a reason to disguise you!`
  },

  // Daft Punk
  {
    id: 'song-16',
    title: 'Get Lucky (feat. Pharrell Williams)',
    artist: 'Daft Punk, Pharrell Williams, Nile Rodgers',
    artistId: 'art-4',
    album: 'Random Access Memories',
    albumId: 'alb-4',
    duration: 248,
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    genre: 'Disco / Funk',
    playsCount: 1200400000,
    addedAt: '2022-01-01T12:00:00Z',
    lyrics: `Like the legend of the phoenix
All ends with beginnings
What keeps the planet spinning
The force from the beginning

We've come too far to give up who we are
So let's raise the bar and our cups to the stars
She's up all night 'til the sun
I'm up all night to get some
She's up all night for good fun
I'm up all night to get lucky!`
  },
  {
    id: 'song-17',
    title: 'Instant Crush (feat. Julian Casablancas)',
    artist: 'Daft Punk, Julian Casablancas',
    artistId: 'art-4',
    album: 'Random Access Memories',
    albumId: 'alb-4',
    duration: 337,
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    genre: 'Synth-pop',
    playsCount: 650000000,
    addedAt: '2022-01-01T12:05:00Z',
    lyrics: `I didn't want to be the one to forget
I thought of something that I'd never forget
One thousand lonely stars and nobody to share them with.`
  },

  // Arctic Monkeys
  {
    id: 'song-18',
    title: 'Do I Wanna Know?',
    artist: 'Arctic Monkeys',
    artistId: 'art-6',
    album: 'AM',
    albumId: 'alb-5',
    duration: 272,
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Rock',
    playsCount: 1980000000,
    addedAt: '2021-08-10T15:00:00Z',
    lyrics: `Have you got colour in your cheeks?
Do you ever get that fear that you can't shift the type
That sticks around like summat in your teeth?
Are there some aces up your sleeve?
Have you no idea that you're in deep?
I dreamt about you nearly every night this week!`
  },
  {
    id: 'song-19',
    title: 'R U Mine?',
    artist: 'Arctic Monkeys',
    artistId: 'art-6',
    album: 'AM',
    albumId: 'alb-5',
    duration: 201,
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Rock',
    playsCount: 990000000,
    addedAt: '2021-08-10T15:05:00Z',
    lyrics: `I'm a puppet on a string
Tracy Island, time-traveling diamond cutter-shaped heartaches
Are you mine tomorrow? Are you mine tonight?`
  },

  // Billie Eilish
  {
    id: 'song-20',
    title: 'bad guy',
    artist: 'Billie Eilish',
    artistId: 'art-5',
    album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    albumId: 'alb-1',
    duration: 194,
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    genre: 'Alternative Pop',
    playsCount: 2450000000,
    addedAt: '2021-05-15T18:00:00Z',
    lyrics: `White shirt now red, my bloody nose
Sleepin', you're on your tippy toes
Creepin' around like no one knows
Think you're so criminal

So you're a tough guy, like it really rough guy
Just can't get enough guy, chest always so puffed guy
I'm that bad type, make your mama sad type
Make your girlfriend mad tight, might seduce your dad type
I'm the bad guy, duh!`
  },
  {
    id: 'song-21',
    title: 'ocean eyes',
    artist: 'Billie Eilish',
    artistId: 'art-5',
    album: 'dont smile at me',
    albumId: 'alb-1',
    duration: 200,
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    genre: 'Bedroom Pop',
    playsCount: 1320000000,
    addedAt: '2021-05-15T18:05:00Z',
    lyrics: `I've been watchin' you for some time
Can't stop starin' at those ocean eyes
Burning cities and napalm skies
Fifteen flares inside those eyes.`
  },

  // Kendrick Lamar
  {
    id: 'song-22',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    artistId: 'art-8',
    album: 'DAMN.',
    albumId: 'alb-2',
    duration: 177,
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    genre: 'Hip-Hop',
    playsCount: 2100000000,
    addedAt: '2022-03-12T14:00:00Z',
    lyrics: `Nobody pray for me
It been that day for me
Way (yeah, yeah!)
Ay, I remember syrup sandwiches and crime allowances
Finesse a ninja with some counterfeits, but now I’m countin' this
Sit down, be humble!`
  },
  {
    id: 'song-23',
    title: 'All The Stars (with SZA)',
    artist: 'Kendrick Lamar, SZA',
    artistId: 'art-8',
    album: 'Black Panther: The Album',
    albumId: 'alb-2',
    duration: 232,
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    genre: 'Hip-Hop',
    playsCount: 1650000000,
    addedAt: '2022-03-12T14:05:00Z',
    lyrics: `Love, let's talk about love
Is it anything and everything you hoped for?
Or do the feeling keep you wanting more?
This may be the night that my dreams might let me know
All the stars are closer!`
  },

  // Collaborative Office & Chill tracks (Matches screenshot 5!)
  {
    id: 'song-24',
    title: 'Head & Heart (feat. MNEK)',
    artist: 'Joel Corry, MNEK',
    artistId: 'art-1',
    album: 'Head & Heart',
    albumId: 'alb-1',
    duration: 166, // 2:46
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    genre: 'Dance',
    playsCount: 1450000000,
    addedAt: '2020-09-15T10:00:00Z',
    lyrics: `Ba-ba-ba-dum, ba-ba-dum
Oh baby, baby, won't you let me know
Are you in my head or in my heart?`
  },
  {
    id: 'song-25',
    title: 'Drive - The Cars',
    artist: 'The Cars',
    artistId: 'art-6',
    album: 'Heartbeat City',
    albumId: 'alb-5',
    duration: 234, // 3:54
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    genre: 'Rock',
    playsCount: 380000000,
    addedAt: '2020-09-15T10:05:00Z',
    lyrics: `Who's gonna tell you when it's too late?
Who's gonna tell you things aren't so great?
You can't go on, thinking nothing's wrong
Who's gonna drive you home tonight?`
  },
  {
    id: 'song-26',
    title: 'Night Calls',
    artist: 'Joe Cocker',
    artistId: 'art-6',
    album: 'Night Calls',
    albumId: 'alb-5',
    duration: 219,
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'Blues Rock',
    playsCount: 95000000,
    addedAt: '2020-09-15T10:10:00Z',
    lyrics: `The night calls to my weary soul
Long dusty highways leading me back home.`
  },
  {
    id: 'song-27',
    title: 'Space Between Mountains',
    artist: 'Kidcrash',
    artistId: 'art-7',
    album: 'Snacks',
    albumId: 'alb-6',
    duration: 280, // 4:40
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    genre: 'Ambient Post-Rock',
    playsCount: 14200000,
    addedAt: '2020-09-15T10:15:00Z',
    lyrics: `In the space between mountains
A quiet river flows through the pines
Echoes of ancient winters
Frozen in crystalline time.`
  },
  {
    id: 'song-28',
    title: 'Midnight City',
    artist: 'M83',
    artistId: 'art-4',
    album: 'Hurry Up, We\'re Dreaming',
    albumId: 'alb-4',
    duration: 243,
    audioUrl: AUDIO_SAMPLE_1,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    genre: 'Synth-pop',
    playsCount: 1100000000,
    addedAt: '2021-04-01T12:00:00Z',
    lyrics: `Waiting in a car
Waiting for a ride in the dark
The night city grows
Look and see her eyes, they glow.`
  },
  {
    id: 'song-29',
    title: 'Self Titled',
    artist: 'Comadre',
    artistId: 'art-6',
    album: 'Comadre',
    albumId: 'alb-5',
    duration: 198,
    audioUrl: AUDIO_SAMPLE_4,
    coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    genre: 'Post-Hardcore',
    playsCount: 8900000,
    addedAt: '2022-05-18T16:00:00Z',
    lyrics: `Signals crossing in the rain
Finding courage through the pain
Nothing stays the same.`
  },
  {
    id: 'song-30',
    title: 'Sleep & Calm',
    artist: 'Moby Ambient',
    artistId: 'art-7',
    album: 'Long Ambients 1: Calm. Sleep.',
    albumId: 'alb-6',
    duration: 320,
    audioUrl: AUDIO_SAMPLE_5,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'Ambient',
    playsCount: 31964000,
    addedAt: '2022-09-01T22:00:00Z',
    lyrics: `[Instrumental Ambient Waves & Deep Resonance]`
  },
  {
    id: 'song-31',
    title: 'Call It Dreaming Radio',
    artist: 'Iron & Wine',
    artistId: 'art-7',
    album: 'Beast Epic',
    albumId: 'alb-6',
    duration: 231,
    audioUrl: AUDIO_SAMPLE_6,
    coverUrl: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=600&q=80',
    genre: 'Indie Folk',
    playsCount: 48900000,
    addedAt: '2023-03-10T11:00:00Z',
    lyrics: `Say it's here where our pieces fall
So let's walk through the garden wall
Call it dreaming, call it true.`
  },
  {
    id: 'song-32',
    title: 'When It Falls',
    artist: 'Zero 7',
    artistId: 'art-4',
    album: 'When It Falls',
    albumId: 'alb-4',
    duration: 330,
    audioUrl: AUDIO_SAMPLE_7,
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    genre: 'Downtempo',
    playsCount: 92400000,
    addedAt: '2023-06-19T14:30:00Z',
    lyrics: `Drifting along on a summer daydream
Watercolors dissolving in the stream
Hold me close when the shadow falls.`
  }
];

export const DEMO_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-office',
    title: 'Office',
    description: 'Ankur Thakur • 51 songs, 3 hr 16 min • Perfect background rhythms for productivity, focus, and good studio vibes.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'usr-1',
      name: 'Ankur Thakur',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    },
    songs: [
      DEMO_SONGS[23], // Head & Heart
      DEMO_SONGS[24], // Drive
      DEMO_SONGS[25], // Night Calls
      DEMO_SONGS[26], // Space Between Mountains
      DEMO_SONGS[0],  // No New Friends
      DEMO_SONGS[5],  // MOVE
      DEMO_SONGS[12], // Blinding Lights
      DEMO_SONGS[15]  // Get Lucky
    ],
    songCount: 51,
    followersCount: 1420,
    gradientColor: 'from-red-900 to-spotify-dark',
    createdAt: 'Sep 15, 2020'
  },
  {
    id: 'pl-no-new-friends',
    title: 'No New Friends EP',
    description: 'By Sia, Diplo, Labrinth • 2019 • 6 songs, 18 min • Hit singles and remixes from LSD.',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'art-1',
      name: 'Sia & LSD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    songs: [
      DEMO_SONGS[0],
      DEMO_SONGS[1],
      DEMO_SONGS[2],
      DEMO_SONGS[3],
      DEMO_SONGS[4]
    ],
    songCount: 6,
    followersCount: 524090,
    gradientColor: 'from-amber-600 to-spotify-dark',
    createdAt: 'Apr 12, 2019'
  },
  {
    id: 'pl-daily-mix-1',
    title: 'Daily Mix 1',
    description: 'By SYRĒN • Dream on Dreamer, Arctic Monkeys, The Weeknd and more. Made for you, refreshed daily.',
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[8], // Let It In
      DEMO_SONGS[17], // Do I Wanna Know
      DEMO_SONGS[18], // R U Mine
      DEMO_SONGS[28], // Self Titled
      DEMO_SONGS[26]  // Space Between Mountains
    ],
    songCount: 25,
    followersCount: 2390100,
    gradientColor: 'from-teal-800 to-spotify-dark',
    createdAt: 'Today'
  },
  {
    id: 'pl-top-hits',
    title: "Today's Top Hits",
    description: 'The hottest tracks right now across pop, hip hop, and global charts.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[12], // Blinding Lights
      DEMO_SONGS[5],  // MOVE
      DEMO_SONGS[6],  // CUFF IT
      DEMO_SONGS[19], // bad guy
      DEMO_SONGS[21], // HUMBLE.
      DEMO_SONGS[0]   // No New Friends
    ],
    songCount: 50,
    followersCount: 34102900,
    gradientColor: 'from-emerald-700 to-spotify-dark',
    createdAt: 'Weekly'
  },
  {
    id: 'pl-chill-hits',
    title: 'Chill Hits',
    description: 'Kick back to the best gentle, melodic, and laid-back songs.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[9],  // Pictures
      DEMO_SONGS[10], // Atlas Hands
      DEMO_SONGS[11], // Gratitude
      DEMO_SONGS[20], // ocean eyes
      DEMO_SONGS[29], // Sleep & Calm
      DEMO_SONGS[30]  // Call It Dreaming
    ],
    songCount: 75,
    followersCount: 6890120,
    gradientColor: 'from-blue-800 to-spotify-dark',
    createdAt: 'Daily'
  },
  {
    id: 'pl-rap-caviar',
    title: 'Hip-Hop Pulse',
    description: 'Music at the top of the hip-hop culture. Updated weekly with new heat.',
    coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[21], // HUMBLE.
      DEMO_SONGS[22], // All The Stars
      DEMO_SONGS[1],  // Genius Remix
      DEMO_SONGS[5],  // MOVE
      DEMO_SONGS[12]  // Blinding Lights
    ],
    songCount: 60,
    followersCount: 15400200,
    gradientColor: 'from-orange-700 to-spotify-dark',
    createdAt: 'Every Friday'
  },
  {
    id: 'pl-rock-classics',
    title: 'Rock Classics',
    description: 'Rock anthems that define the spirit of electric guitar and stadium energy.',
    coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[17], // Do I Wanna Know
      DEMO_SONGS[18], // R U Mine
      DEMO_SONGS[24], // Drive
      DEMO_SONGS[8],  // Let It In
      DEMO_SONGS[25]  // Night Calls
    ],
    songCount: 100,
    followersCount: 11200400,
    gradientColor: 'from-purple-900 to-spotify-dark',
    createdAt: 'Classic'
  },
  {
    id: 'pl-deep-focus',
    title: 'Deep Focus & Ambient Study',
    description: 'Keep calm and focus with atmospheric ambient soundscapes and gentle pulses.',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[29], // Sleep & Calm
      DEMO_SONGS[26], // Space Between Mountains
      DEMO_SONGS[31], // When It Falls
      DEMO_SONGS[9],  // Pictures
      DEMO_SONGS[27]  // Midnight City
    ],
    songCount: 80,
    followersCount: 4200100,
    gradientColor: 'from-cyan-900 to-spotify-dark',
    createdAt: 'Always'
  },
  {
    id: 'pl-discover-weekly',
    title: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you every Monday.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    isPublic: true,
    creator: {
      id: 'syren',
      name: 'SYRĒN',
      avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&q=80'
    },
    songs: [
      DEMO_SONGS[15], // Get Lucky
      DEMO_SONGS[16], // Instant Crush
      DEMO_SONGS[3],  // Thunderclouds
      DEMO_SONGS[7],  // BREAK MY SOUL
      DEMO_SONGS[14]  // In Your Eyes
    ],
    songCount: 30,
    followersCount: 8900400,
    gradientColor: 'from-amber-700 to-spotify-dark',
    createdAt: 'Every Monday'
  }
];

export const DEMO_FRIENDS_ACTIVITY = [
  {
    id: 'fr-1',
    name: 'xjovox',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    songTitle: 'Selfish Vow',
    artist: 'Takafumi Matsubara',
    album: 'Strange, Beautiful ...',
    timeAgo: '10 h'
  },
  {
    id: 'fr-2',
    name: 'Zrinko Maloseja',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    songTitle: 'There Is No Horizon',
    artist: 'Ulcerate',
    album: 'Stare Into Death A...',
    timeAgo: '15 h'
  },
  {
    id: 'fr-3',
    name: 'Scott James Cam...',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    songTitle: 'We Could Leave',
    artist: 'Mansionair',
    album: 'Shadowboxer',
    timeAgo: '16 h'
  },
  {
    id: 'fr-4',
    name: 'Jón Svan Sverrisson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    songTitle: "Rollin' & Tumblin'",
    artist: 'Elmore James',
    album: 'Shake Your Money...',
    timeAgo: '18 h'
  }
];

export const BROWSE_GENRES = [
  { id: 'podcasts', name: 'Podcasts', color: 'bg-emerald-600', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80' },
  { id: 'made-for-you', name: 'Made For You', color: 'bg-blue-700', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' },
  { id: 'charts', name: 'Charts', color: 'bg-purple-800', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80' },
  { id: 'new-releases', name: 'New Releases', color: 'bg-pink-700', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80' },
  { id: 'pop', name: 'Pop', color: 'bg-rose-600', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 'hip-hop', name: 'Hip-Hop', color: 'bg-amber-600', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 'rock', name: 'Rock', color: 'bg-red-700', image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=300&q=80' },
  { id: 'dance', name: 'Dance / Electronic', color: 'bg-teal-600', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80' },
  { id: 'indie', name: 'Indie', color: 'bg-orange-600', image: 'https://images.unsplash.com/photo-1445985543468-79086bb88493?auto=format&fit=crop&w=300&q=80' },
  { id: 'rnb', name: 'R&B', color: 'bg-indigo-700', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80' },
  { id: 'chill', name: 'Chill & Relax', color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80' },
  { id: 'focus', name: 'Focus & Study', color: 'bg-slate-700', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }
];
