import { Injectable } from '@angular/core';
import { ExternalProvider } from "@ethersproject/providers";
import { ethers, BigNumber, ContractTransaction } from 'ethers';
import DappazonAbi from "../../../../crypto/artifacts/contracts/Dappazon.sol/Dappazon.json";
import { Dappazon } from "../../../../crypto/typechain-types";
import configuration from '../../environments/environment';
import { BehaviorSubject, filter, from, map, Observable, of, retry, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../shared/models/product';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

type DappazonProvider = {
  dappazon: Dappazon,
  provider: ethers.providers.Web3Provider
}

 @Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private dappazon: Dappazon = null;
  private accountSource = new BehaviorSubject<string>("");
  account$ = this.accountSource.asObservable();

  constructor(private toastrService: ToastrService) {}


  buyItem(product: IProduct): Observable<ContractTransaction> {
    return this.loadDappazonContract(false).pipe(
      filter(d => d.dappazon !== null),
      switchMap(dapp =>
        dapp.dappazon
        .connect(dapp.provider.getSigner())
        .buy(BigNumber.from(product.id), {
          value: ethers.utils.parseEther(product.price.toString(10))
        })
      )
    );
  }

  getItems(filters: Dappazon.FilterStruct): Observable<IPagination> {
    return this.loadDappazonContract(false).pipe(
      filter(d => d !== null),
      switchMap(dapp => {
        return from(dapp.dappazon.queryItems(filters)).pipe(
          map((response) => {
            const [items, filtersBack] = response;
            const pagination: IPagination = {
              data: [],
              count: filtersBack.itemsCount.toNumber(),
              pageIndex: filtersBack.pageNumber.toNumber(),
              pageSize: filtersBack.pageSize.toNumber()
            };
            items.forEach(i => {
              pagination.data.push(this.formatItemToProduct(i));
            });
            return pagination;
          })
        );
      })
    );
  }

  getItem(itemId: number): Observable<IProduct> {
    return this.loadDappazonContract(false).pipe(
      filter(dapp => dapp !== null),
      switchMap(dapp => {
        return from(dapp.dappazon.getItem(BigNumber.from(itemId))).pipe(
          map((item: Dappazon.ItemStructOutput) => {
            return this.formatItemToProduct(item);
          })
        )
      })
    );
  }

  getBrands(): Observable<IBrand[]> {
    return this.loadDappazonContract(false).pipe(
      filter(dapp => dapp !== null),
      switchMap(dapp => {
        return from(dapp.dappazon.getLimitBrands(BigNumber.from(10))).pipe(
          map((resp: Dappazon.BrandStructOutput[]) => {
            const brands: IBrand[] = [];
            resp.forEach(i => {
              if(i.id.toNumber() != 0 && i.name != "") {
                brands.push(this.formatBrand(i));
              }
            });
            return brands;
          })
        )
      })
    );
  }

  getCategories(): Observable<IType[]> {
    return this.loadDappazonContract(false).pipe(
      filter(dapp => dapp !== null),
      switchMap(dapp => {
        return from(dapp.dappazon.getLimitCategories(BigNumber.from(10))).pipe(
          map((resp: Dappazon.CategoryStructOutput[]) => {
            const categories: IType[] = [];
            resp.forEach(i => {
              if(i.id.toNumber() != 0 && i.name != "") {
                categories.push(this.formatCategory(i));
              }
            });
            return categories;
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

  loadDappazonContract(reload: boolean): Observable<DappazonProvider> {
    if(!this.verifyMetamaskExtension()) return of(null);

    return of(this.dappazon).pipe(
      switchMap((dapp: Dappazon) => {
        if(dapp !== null && reload === false) {
          const provider = new ethers.providers.Web3Provider(window.ethereum!);
          return of({dappazon: dapp, provider: provider});
        }
        else {
          const provider = new ethers.providers.Web3Provider(window.ethereum!);
          return from(provider.getNetwork()).pipe(
            map((network: ethers.providers.Network) => {
              const dapp: Dappazon = new ethers.Contract(
                configuration.crypto[network.chainId].dappazon.address,
                DappazonAbi.abi,
                provider
              ) as Dappazon;
              this.dappazon = dapp;
              return {dappazon: dapp, provider: provider};
            })
          );
        }
      })
    );
  }

  parseMetamaskError(e: any) {
    let errore: string = e.toString();
    const search = 'reverted with reason string \'';
    let idxStart = errore.indexOf(search);
    if (idxStart > -1) {
      idxStart += search.length;
      let idxEnd = errore.indexOf('\'"', idxStart);
      errore = errore.substring(idxStart, idxEnd);
      this.toastrService.error(errore);
    }
    else {
      this.toastrService.error("Unexpected error while processing transaction");
    }
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
      description: i.description,
      name: i.name,
      pictureUrl: i.image,
      price: parseFloat(price),
      productBrand: i.brand.name,
      productType: i.category.name,
      rating: i.rating.toNumber(),
      stock: i.stock.toNumber(),
      isCrypto: true
    };
  }

  private formatBrand(i: Dappazon.BrandStructOutput): IBrand {
      return {
      id: i.id.toNumber(),
      name: i.name
    };
  }

  private formatCategory(i: Dappazon.CategoryStructOutput): IType {
    return {
    id: i.id.toNumber(),
    name: i.name
  };
}
}
