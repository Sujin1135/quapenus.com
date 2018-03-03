import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SongComponent } from './song.component';
import { SongProductComponent } from '../song-product/song-product.component';

describe('SongComponent', () => {
    beforeEach(async(()=>{
        TestBed.configureTestingModule({
            declarations : [SongComponent, SongProductComponent],
            imports : [RouterTestingModule]
        })
        .compileComponents();    
    }));
})