import config from './config'
import _ from 'lodash'
import * as generated from './generated'

import { UsersPostPreferEnum } from './generated'

const api = {
  votes: new generated.VotesApi(config),
  songs: new generated.SongsApi(config),
  playlists: new generated.PlaylistsApi(config),
  metadata: new generated.MetadataApi(config),
  users: new generated.UsersApi(config),
  events: new generated.EventsApi(config),
}

export const mapLastFmItemToBop = (song: any) => {
  return _.pickBy({
    artist: song.artist,
    title: song.name,
    album: '',
    thumbnail_url: song.image[3]['#text'],
    mbid: song.mbid, // musicbrainz id
  })
}

export const mapMusicBrainzItemtoBop = (song: any) => {
  return _.pickBy({
    title: song.title,
    album: song.releases[0].title,
    artist: song['artist-credit'][0].artist.name,
    mbid: song.id, // musicbrainz id
    score: song.score,
  })
}

class BopSdk {
  getSongsInPlaylist = async ({ playlistId, offset = 0, limit = 5000 }) => {
    // hardcoded all playlist
    if (playlistId === 17) {
      return this.getSongsInAllPlaylist({ offset, limit })
    }

    return api.songs.songsGet({
      playlistId: playlistId,
      offset: offset.toString(),
      limit: limit.toString(),
      select: '*,metadata(*),votes(*),user_added(id,username),playlists(*)',
    })
  }

  //todo need better system
  getSongsInAllPlaylist = async ({ offset, limit = 5000 }): Promise<any> => {
    return api.songs.songsGet({
      offset: offset.toString(),
      limit: limit.toString(),
      select: '*,metadata(*),votes(*),user_added(id,username),playlists(*)',
    })
  }

  getSongsAddedByUser = async ({ userId, limit = 5000, offset = 0 }): Promise<Array<ApiSongs>> => {
    const songs = await api.songs.songsGet({
      id: userId,
      offset: offset.toString(),
      limit: limit.toString(),
      select: '*,songs(*)',
    })
    return songs
  }

  createPlaylist = async ({ playlistName, userId }: { playlistName: string; userId: number }) => {
    await api.playlists.playlistsPost({
      playlists: { name: playlistName, userAdded: userId } as any,
    })

    // TODO handle failure?
    return { success: true, name: playlistName, userId }
  }

  getPlaylistForName = async (playlistName: string): Promise<Array<ApiPlaylists>> => {
    const playlists = await api.playlists.playlistsGet({
      name: `eq.${encodeURIComponent(playlistName)}`,
      select: '*',
    })

    if (_.isEmpty(playlists)) {
      throw new Error('No Playlist Matching Name: ' + playlistName)
    }
    return playlists
  }

  addSongToPlaylist = async ({ playlistId, userId, metaId }) => {
    const song: generated.Songs = {
      playlistId: playlistId,
      userAdded: userId,
      metadataId: metaId,
    }

    await api.songs.songsPost({ songs: song })
  }

  getSongMetadata = async ({
    youtubeId,
    title,
    artist,
  }: {
    youtubeId?
    title?
    artist?
  }): Promise<generated.Metadata> => {
    const metadataParams: any = {}

    youtubeId && (metadataParams.youtubeId = `eq.${youtubeId}`)
    title && (metadataParams.title = `eq.${title}`)
    artist && (metadataParams.artist = `eq.${artist}`)

    const metadata = await api.metadata.metadataGet(metadataParams)
    return _.first(metadata) as generated.Metadata
  }

  addSongMetadata = async (metadata): Promise<generated.Metadata | undefined> => {
    const resp: Array<generated.Metadata> = ((await api.metadata.metadataPostRaw({
      metadata,
      prefer: generated.MetadataPostPreferEnum.Representation,
    })) as unknown) as Array<generated.Metadata>

    return _.first(resp)
  }

  getAllUsers = async ({ limit = 5000 } = {}): Promise<Array<ApiUser>> => {
    return api.users.usersGet({ limit: String(limit) })
  }

  getAllSongs = async ({ limit = 5000 } = {}): Promise<Array<ApiSongs>> => {
    return await api.songs.songsGet({
      limit: String(limit),
      select: '*,metadata(*),votes(*),user_added(id,username),playlists(*)',
    })
  }

  getUser = async (optionalUsername, optionalPassword): Promise<Array<ApiUser>> => {
    const users = await api.users.usersGet({ username: `eq.${optionalUsername}` })

    if (_.isEmpty(users)) {
      throw new Error('No User Matching Description')
    }
    return users
  }

  putUser = async (username, password): Promise<generated.Users> => {
    if (username === '') {
      return Promise.reject('fuck you make a username')
    }

    const user: generated.Users = { username, password: 'todo' }
    const resp = ((await api.users.usersPostRaw({
      users: user,
      prefer: UsersPostPreferEnum.Representation,
    })) as unknown) as generated.Users

    return resp
  }

  vote = async ({ userId, songId }: any) => {
    const voteResp = await api.votes.votesPost({
      votes: { songId, userAdded: userId },
    })

    return { userId, songId, voteResp }
  }

  unvote = async ({ userId, songId }) => {
    const unvoteResp = await api.votes.votesDelete({
      userAdded: userId,
      songId: songId,
    })

    return { userId, songId, unvoteResp }
  }

  deleteSong = async (song) => {
    const songId = song.id
    // fk constraint on votes
    try {
      await api.votes.votesDelete({ songId })
      await api.songs.songsDelete({ id: song.id })
    } catch (err) {
      console.error(err)
    }

    return { song }
  }

  searchYoutube = async ({ title, artist }) => {
    const endpoint =
      'https://www.googleapis.com/youtube/v3/search?type=video&maxResults=20&key=AIzaSyAPGx5PbhdoO2QTR16yZHgMj-Q2vqO8W1M&part=snippet'
    const searchTerm = encodeURIComponent(`${title} ${artist}`)
    const res = await fetch(`${endpoint}&q=${searchTerm}`)
    const json = await res.json()

    const first = json.items[0]
    return {
      youtube_id: first.id.videoId,
      youtube_title: first.snippet.title,
    }
  }

  getEvents = async ({ limit = 5000 }): Promise<Array<generated.Events>> => {
    return api.events.eventsGet({ limit: String(limit) })
  }

  getYoutubeVideoDuration = async (youtube_id) => {
    const endpoint =
      'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyAPGx5PbhdoO2QTR16yZHgMj-Q2vqO8W1M'
    const res = await fetch(`${endpoint}&id=${youtube_id}`)
    const json = await res.json()
    const youtube_duration = json.items[0].contentDetails.duration
    return { youtube_duration }
  }

  searchForSongLastFm = async (query) => {
    const encodedQuery = encodeURIComponent(query)
    const endpoint = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodedQuery}&format=json&api_key=39e1ebe26072b1ee0c6b4b9c1ca22889`
    try {
      const res: any = await fetch(endpoint)
      const json = await res.json()
      return _.map(json.results.trackmatches.track, mapLastFmItemToBop)
    } catch (err) {
      console.error('fuck, lastfm search didnt work', err)
      return []
    }
  }
  searchForSongMusicBrainz = async (query) => {
    const encodedQuery = encodeURIComponent(query)
    const endpoint = `http://musicbrainz.org/ws/2/recording/?fmt=json&dismax=true&query=${encodedQuery}`
    try {
      const res: any = await fetch(endpoint)
      const json = await res.json()
      return _.map(json.recordings, mapMusicBrainzItemtoBop)
    } catch (err) {
      console.error('fuck, mb search didnt work', err)
      return []
    }
  }
  // searchForSongMergedExperiment = async query => {
  // 	const [mbData, lastFmData] = await Promise.all([
  // 		this.searchForSongMusicBrainz(query),
  // 		this.searchForSongLastFm(query),
  // 	]);
  // 	console.error('mbdata: ', mbData, 'lastFmData', lastFmData);
  // 	const keyedMbData = _.mapKeys(
  // 		mbData,
  // 		(s: any) => s.artist.toUpperCase() + s.title.toUpperCase()
  // 	);
  // 	const keyedlastFmData = _.mapKeys(
  // 		lastFmData,
  // 		(s: any) => s.artist.toUpperCase() + s.title.toUpperCase()
  // 	);
  // 	const merged = _.merge({}, keyedMbData, keyedlastFmData);
  // 	const sorted = _.sortBy(_.values(merged), 'score');
  // 	return sorted;
  // };
  searchForSong = async (query) => {
    const trackSearch = await this.searchForSongLastFm(query)
    return trackSearch
  }
}

;(window as any).api = api

const sdk = new BopSdk()
;(window as any).sdk = sdk

export default sdk

export type ApiSongs = generated.Songs
export type ApiMetadata = generated.Metadata
export type ApiUser = generated.Users
export type ApiVotes = generated.Votes
export type ApiPlaylists = generated.Playlists
