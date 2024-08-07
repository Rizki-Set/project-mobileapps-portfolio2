import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-akun',
  templateUrl: './akun.page.html',
  styleUrls: ['./akun.page.scss'],
})
export class AkunPage implements OnInit {

  constructor(
    public app: AuthService
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    // This is intentionally left empty
  }
}
