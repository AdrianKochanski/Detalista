import { Injectable } from '@angular/core';
import { ExternalProvider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import DappazonAbi from "../../../../crypto/artifacts/contracts/Dappazon.sol/Dappazon.json";
import { Dappazon } from "../../../../crypto/typechain-types";
import configuration from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../shared/models/product';

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

  private productsSource = new BehaviorSubject<IProduct[]>([]);
  products$ = this.productsSource.asObservable();

  constructor(private toastrService: ToastrService) {}

  async getItems() {
    if(this.getCurrentDappazon() == null) return;

    const items: Dappazon.ItemStructOutput[] = await this.dappazonSource.value.queryItems();
    const products: IProduct[] = [];

    items.forEach(i => {
      const price = ethers.utils.formatEther(i.cost);

      products.push({
        id: i.id.toNumber(),
        description: i.name,
        name: i.name,
        pictureUrl: i.image,
        price: parseFloat(price),
        productBrand: "",
        productType: ""
      });
    });

    this.productsSource.next(products);
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
