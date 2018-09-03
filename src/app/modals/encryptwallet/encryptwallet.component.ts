import { Component, forwardRef, Inject, ViewChild } from '@angular/core';
import { Log } from 'ng2-logger';
import { MatDialogRef } from '@angular/material';

import { PasswordComponent } from '../shared/password/password.component';
import { IPassword } from '../shared/password/password.interface';

import { RpcService } from '../../core/core.module';
import { SnackbarService } from '../../core/snackbar/snackbar.service'; // TODO; import from module
import { ModalsHelperService } from 'app/modals/modals-helper.service';

@Component({
  selector: 'app-encryptwallet',
  templateUrl: './encryptwallet.component.html',
  styleUrls: ['./encryptwallet.component.scss']
})
export class EncryptwalletComponent {

  log: any = Log.create('encryptwallet.component');
  public password: string;

  @ViewChild('passwordElement') passwordElement: PasswordComponent;

  constructor(
    @Inject(forwardRef(() => ModalsHelperService))
    private _rpc: RpcService,
    private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<EncryptwalletComponent>
  ) { }

  async encryptwallet(password: IPassword) {
    // set password first time
    if (!this.password) {
      this.log.d(`Setting password: ${password.password}`);
      this.password = password.password;
      this.passwordElement.clear();
      return;
    }

    // already had password, check equality
    this.log.d(`check password equality: ${password.password === this.password}`);
    if (this.password !== password.password) {
      this.flashNotification.open('The passwords do not match!', 'err');
      return;
    }

    // passwords match, encrypt wallet

    this._rpc.call('encryptwallet', [password.password]).toPromise()
      .catch(error => {
        // Handle error appropriately
        this.flashNotification.open('Wallet failed to encrypt properly!', 'err');
        this.log.er('error encrypting wallet', error)
      });


  }

  clearPassword(): void {
    this.password = undefined;
  }
}
