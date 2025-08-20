import { Injectable, OnInit } from '@angular/core';
import webtorrent from 'webtorrent'

@Injectable({
  providedIn: 'root'
})
export class WebtorrentService {
  client! : webtorrent.Instance
  constructor() {
    this.client =  new (<any>window)['WebTorrent']({dht : false});
  }
}
