import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { JoinComponent } from './components/join/join.component';
import { NavbarComponent } from './components/navbar/quapenus-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { MypageComponent } from './components/mypage/mypage.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SongProductComponent } from './components/song-product/song-product.component';
import { HomeComponent } from './components/home/home.component';
import { SongComponent } from './components/song/song.component';
import { SongDetailComponent } from './components/song-detail/song-detail.component';
import { SongWriteComponent } from './components/song-write/song-write.component';
import { FooterComponent } from './components/footer/footer.component';
import { routing } from './app.routing';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthGuard } from './services/auth.guard.service';
import { HttpService } from './services/Http-observable.service';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs/Observable';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { User } from './models/user';

@NgModule({
    imports : [BrowserModule, routing, ReactiveFormsModule, FormsModule,
                HttpModule],
    declarations : [AppComponent, NavbarComponent, JoinComponent, LoginComponent,
                    MypageComponent, CarouselComponent, HomeComponent, SongComponent,
                    SongProductComponent, SongDetailComponent, SongWriteComponent,
                    FooterComponent, FileSelectDirective, FileDropDirective],
    bootstrap : [AppComponent],
    providers : [{ provide : LocationStrategy, useClass : HashLocationStrategy },
                      AuthGuard, HttpService, UserService, User]
})
export class AppModule {}
