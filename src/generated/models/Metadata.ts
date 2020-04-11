/* tslint:disable */
/* eslint-disable */
/**
 * PostgREST API
 * standard public schema
 *
 * The version of the OpenAPI document: 7.0.0 (2b61a63)
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Metadata
 */
export interface Metadata {
    /**
     * Note: This is a Primary Key.<pk/>
     * @type {number}
     * @memberof Metadata
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    youtubeId: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    youtubeTitle: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    artist?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    thumbnailUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    album?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    youtubeDuration?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    dateAdded?: string;
}

export function MetadataFromJSON(json: any): Metadata {
    return MetadataFromJSONTyped(json, false);
}

export function MetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): Metadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'youtubeId': json['youtube_id'],
        'youtubeTitle': json['youtube_title'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'artist': !exists(json, 'artist') ? undefined : json['artist'],
        'thumbnailUrl': !exists(json, 'thumbnail_url') ? undefined : json['thumbnail_url'],
        'album': !exists(json, 'album') ? undefined : json['album'],
        'youtubeDuration': !exists(json, 'youtube_duration') ? undefined : json['youtube_duration'],
        'dateAdded': !exists(json, 'date_added') ? undefined : json['date_added'],
    };
}

export function MetadataToJSON(value?: Metadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'youtube_id': value.youtubeId,
        'youtube_title': value.youtubeTitle,
        'title': value.title,
        'artist': value.artist,
        'thumbnail_url': value.thumbnailUrl,
        'album': value.album,
        'youtube_duration': value.youtubeDuration,
        'date_added': value.dateAdded,
    };
}


