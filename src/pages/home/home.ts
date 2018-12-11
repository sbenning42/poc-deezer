import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DeezerProvider } from '../../providers/deezer/deezer';
import { switchMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  deezerArtists$: Observable<any[]>;
  deezerArtists: any[];

  constructor(
    public navCtrl: NavController,
    public deezer: DeezerProvider,
    public detector: ChangeDetectorRef
  ) {

  }

  oAuthAndFetchDeezerArtists() {

    const allUserArtists = (token: string) => Observable.zip(
      this.deezer.userArtists(token),
      this.deezer.userArtistsRecommendations(token),
    );

    const concatArtists = ([artists, recommendations]: [any[], any[]]) => {
      return artists.concat(...recommendations);
    };

    const deezerArtists$ = this.deezer.oAuth().pipe(
      switchMap(allUserArtists),
      map(concatArtists),
      tap(console.log),
      tap((allArtists: any[]) => {
        this.deezerArtists = allArtists;
        console.log(this.deezerArtists);
        this.detector.detectChanges();
      }),
    );

    deezerArtists$.subscribe(artistes => alert(artistes && artistes[0] && artistes[0].name ? artistes[0].name : '...'));

  }

}
