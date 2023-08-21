import { TestBed } from '@angular/core/testing';

import { StickyJsonService } from './sticky-json.service';

describe('StickyJsonService', () => {
  let service: StickyJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StickyJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
