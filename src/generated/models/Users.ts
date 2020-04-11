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

/**
 *
 * @export
 * @interface Users
 */
export interface Users {
  /**
   * Note: This is a Primary Key.<pk/>
   * @type {number}
   * @memberof Users
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof Users
   */
  username: string
  /**
   *
   * @type {string}
   * @memberof Users
   */
  password: string
}

export function UsersFromJSON(json: any): Users {
  return UsersFromJSONTyped(json, false)
}

export function UsersFromJSONTyped(json: any, ignoreDiscriminator: boolean): Users {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json['id'],
    username: json['username'],
    password: json['password'],
  }
}

export function UsersToJSON(value?: Users | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    username: value.username,
    password: value.password,
  }
}
