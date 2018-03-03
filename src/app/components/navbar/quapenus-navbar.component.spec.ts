import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from './quapenus-navbar.component';
import { MypageComponent } from '../mypage/mypage.component';

describe('NavbarComponent', () => {
    beforeEach(async(()=>{
        TestBed.configureTestingModule({
            declarations : [NavbarComponent, MypageComponent],
            imports : [RouterTestingModule]
        })
        .compileComponents();    
    }));
})