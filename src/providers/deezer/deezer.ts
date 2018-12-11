import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { Observable } from 'rxjs';
import { tap, catchError, filter, pluck, map } from 'rxjs/operators';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserObject } from '@ionic-native/in-app-browser';

/*
  Generated class for the DeezerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeezerProvider {

  appId = '316584';
  appSecret = '2b428b151587c07621105cf6d9c6d371';
  redirectUrl = 'http://localhost/deezer.html';
  responseType = 'token';

  baseApi = 'http://192.168.1.13:5000/deezer';
  oAuthBaseApi = 'https://connect.deezer.com/oauth';

  constructor(
    public http: HttpClient,
    public storage: StorageProvider,
    public iab: InAppBrowser
  ) {
    console.log('Hello DeezerProvider Provider');
  }

  oAuth(wantedPerms: string[] = ['basic_access', 'email', 'offline_access']): Observable<string> {
    const alertAndPropagateError = (error: Error) => {
      alert(error.name || 'Unknow Error');
      return Observable.throw(error);
    }
    const queryPerms = wantedPerms.join(',');
    const queryParams = `app_id=${this.appId}&redirect_uri=${this.redirectUrl}&perms=${queryPerms}&response_type=${this.responseType}`;
    const endpoint = `${this.oAuthBaseApi}/auth.php?${queryParams}`;
    const closingUrl = (testUrl: string) => testUrl.startsWith(this.redirectUrl);
    const extractToken = (magicUrl: string) => {
      const matchs = /access_token=(.*?)(?:&.*)?$/gm.exec(magicUrl);
      return matchs && matchs[1] ? matchs[1].toString() : '';
    };
    const openOAuthInAppAndCloseWhenFinish = () => {
      const browser = this.iab.create(endpoint, '_self');
      return browser.on('loadstart').pipe(
        catchError(alertAndPropagateError),
        pluck('url'),
        filter(closingUrl),
        map(extractToken),
        tap(() => browser.close()),
        // tap(token => alert(token)),
      );
    };
    return Observable.defer(openOAuthInAppAndCloseWhenFinish);
  }

  user(token: string): Observable<any> {
    const tokenParam = `access_token=${token}`;
    const endpoint = `${this.baseApi}/user/me?${tokenParam}`;
    return this.http.get(endpoint);
  }

  userArtistsRecommendations(token: string) {
    const tokenParam = `access_token=${token}`;
    const endpoint = `${this.baseApi}/user/me/recommendations/artists?${tokenParam}`;
    return this.http.get(endpoint).pipe(pluck('data'));
  }

  userArtists(token: string) {
    const tokenParam = `access_token=${token}`;
    const endpoint = `${this.baseApi}/user/me/artists?${tokenParam}`;
    return this.http.get(endpoint).pipe(pluck('data'));
  }

}

          /*
        alert('HERE SOMEHOW ......');
        console.log('HERE SOMEHOW ......');
          alert('Event DeezerProvider@oAuth@openOAuthInAppAndCloseWhenFinish: ' + JSON.stringify(event));
          console.log('Event DeezerProvider@oAuth@openOAuthInAppAndCloseWhenFinish: ', event);
          */
