import { Injectable } from '@angular/core';
import { ExternalProvider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import DappazonAbi from "../../../../crypto/artifacts/contracts/Dappazon.sol/Dappazon.json";
import { Dappazon } from "../../../../crypto/typechain-types";
import configuration from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

 @Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private accountSource = new BehaviorSubject<string>("");
  account$ = this.accountSource.asObservable();

  private dappazonSource = new BehaviorSubject<ethers.Contract>(null);
  dappazon$ = this.dappazonSource.asObservable();

  private itemsSource = new BehaviorSubject<Dappazon.ItemStructOutput[]>([]);
  itemst$ = this.itemsSource.asObservable();

  constructor(private toastrService: ToastrService) {
    console.log(configuration);
    console.log(DappazonAbi);
  }

  async getItems() {
    if(this.getCurrentDappazon() == null) return;

    const items: Dappazon.ItemStructOutput[] = await this.dappazonSource.value.queryItems();
    this.itemsSource.next(items);
  }

  getCurrentAccount(): string {
    return this.accountSource.value;
  }

  async fetchEthereumAddress(): Promise<void> {
    if(!this.verifyMetamaskExtension()) return;
    const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
    const account = ethers.utils.getAddress(accounts[0]);
    this.accountSource.next(account);
  }

  getCurrentDappazon(): ethers.Contract | null {
    return this.dappazonSource.value;
  }

  async loadDappazonContract(): Promise<void> {
    if(!this.verifyMetamaskExtension()) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum!);
      const network = await provider.getNetwork();

      const dappazon = new ethers.Contract(
        configuration.crypto[network.chainId].dappazon.address,
        DappazonAbi.abi,
        provider
      );

      this.dappazonSource.next(dappazon);
  }

  private verifyMetamaskExtension(): boolean {
    if(window.ethereum) {
      return true;
    }
    else {
      this.toastrService.warning("Please install metamask extension");
      return false;
    }
  }
}
