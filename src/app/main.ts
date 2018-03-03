import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';
import *as webpack from 'webpack';

if(webpack.MODE === 'production'){
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);