import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TippyModule } from '@ngneat/helipopper';
import { IconModule } from '../icon/icon.module';
import { HeaderComponent } from './header.component';
@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, IconModule, TippyModule],
})
export class HeaderModule {}
