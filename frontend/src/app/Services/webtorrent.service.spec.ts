import { TestBed } from '@angular/core/testing';

import { WebtorrentService } from './webtorrent.service';

describe('WebtorrentService', () => {
  let service: WebtorrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebtorrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
