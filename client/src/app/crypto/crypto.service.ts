import { Injectable } from '@angular/core';
import { ExternalProvider } from "@ethersproject/providers";
import { ethers, BigNumber } from 'ethers';
import DappazonAbi from "../../../../crypto/artifacts/contracts/Dappazon.sol/Dappazon.json";
import { Dappazon } from "../../../../crypto/typechain-types";
import configuration from '../../environments/environment';
import { BehaviorSubject, filter, from, map, Observable, of, switchMap } from 'rxjs';
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
  private dappazon: ethers.Contract = null;
  private accountSource = new BehaviorSubject<string>("");
  account$ = this.accountSource.asObservable();

  constructor(private toastrService: ToastrService) {}

  getItems(): Observable<IProduct[]> {
    return this.loadDappazonContract(false).pipe(
      filter(d => d !== null),
      switchMap(dapp => {
        return from(dapp.queryItems()).pipe(
          map((items: Dappazon.ItemStructOutput[]) => {
            const products: IProduct[] = [];
            items.forEach(i => {
              products.push(this.formatItemToProduct(i));
            });
            return products;
          })
        );
      })
    );
  }

  getItem(itemId: number): Observable<IProduct> {
    return this.loadDappazonContract(false).pipe(
      filter(dapp => dapp !== null),
      switchMap(dapp => {
        return from(dapp.getItem(BigNumber.from(itemId))).pipe(
          map((item: Dappazon.ItemStructOutput) => {
            return this.formatItemToProduct(item);
          })
        )
      })
    );
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

  loadDappazonContract(reload: boolean): Observable<ethers.Contract> {
    if(!this.verifyMetamaskExtension()) return of(null);

    return of(this.dappazon).pipe(
      switchMap((dapp: ethers.Contract) => {
        if(dapp !== null && reload === false) {
          return of(dapp);
        }
        else {
          const provider = new ethers.providers.Web3Provider(window.ethereum!);

          return from(provider.getNetwork()).pipe(
            map((network: ethers.providers.Network) => {
              const dapp: ethers.Contract = new ethers.Contract(
                configuration.crypto[network.chainId].dappazon.address,
                DappazonAbi.abi,
                provider
              );
              this.dappazon = dapp;
              return dapp;
            })
          );
        }
      })
    );
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

  private formatItemToProduct(i: Dappazon.ItemStructOutput): IProduct {
    const price = ethers.utils.formatEther(i.cost);

    return {
    id: i.id.toNumber(),
    description: i.name,
    name: i.name,
    pictureUrl: i.image,
    price: parseFloat(price),
    productBrand: "",
    productType: ""
  };
}
}
