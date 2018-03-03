import { Routes, RouterModule, CanActivate } from '@angular/router';
import { JoinComponent } from './components/join/join.component';
import { HomeComponent } from './components/home/home.component';
import { SongComponent } from './components/song/song.component';
import { SongDetailComponent } from './components/song-detail/song-detail.component';
import { SongWriteComponent } from './components/song-write/song-write.component';
import { AuthGuard } from './services/auth.guard.service';

const routes : Routes = [
    { path : '', component : HomeComponent },
    { path : 'song', component : SongComponent },
    { path : 'song/write', component : SongWriteComponent, canActivate: [AuthGuard] },
    { path : 'song/:id', component : SongDetailComponent, canActivate: [AuthGuard] }
];

export const routing = RouterModule.forRoot(routes);
