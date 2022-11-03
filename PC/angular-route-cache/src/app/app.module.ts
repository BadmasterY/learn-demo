import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RouterService } from './service/router.service';

@NgModule({
  declarations: [AppComponent, IndexComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: RouterService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
