import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopServiceBase } from '../shared/helpers/ShopServiceBase';
import configuration from 'src/environments/environment';
import { IType } from '../shared/models/productType';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { filter, switchMap, from, map, Observable, of, tap, BehaviorSubject } from 'rxjs';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import DappazonAbi from "../../../../crypto/artifacts/contracts/Dappazon.sol/Dappazon.json";
import { Dappazon } from "../../../../crypto/typechain-types";
import { ToastrService } from 'ngx-toastr';
import { ExternalProvider } from '@ethersproject/providers';

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
export class CryptoShopService extends ShopServiceBase {
  private initialized: boolean = false;
  private dappazon: Dappazon = null;
  private accountSource = new BehaviorSubject<string>("");
  account$ = this.accountSource.asObservable();

  initialize() {
    if(this.initialized) {
      return;
    }
    else {
      this.initialized = true;
    }

    this.getCachedBrands(() => {
      return this.http.get<IBrand[]>(configuration.apiUrl + 'crypto/brands');
    }).subscribe(() => {
    }, error => {
      console.log(error);
    });

    this.getCachedTypes(() => {
      return this.http.get<IType[]>(configuration.apiUrl + 'crypto/types');
    }).subscribe(() => {
    }, error => {
      console.log(error);
    });

    this.shopParams$.pipe(
      filter(f => f.filterChanged),
      switchMap(shopParams => this.getCachedProducts(
        () => {
          let params = new HttpParams();

          if(shopParams.brandIdSelected !== 0) {
            params = params.append("brandId", shopParams.brandIdSelected.toString());
          }

          if(shopParams.typeIdSelected !== 0) {
            params = params.append("typeId", shopParams.typeIdSelected.toString());
          }

          if (shopParams.search) {
            params = params.append("search", shopParams.search);
          }

          params = params.append("sort", shopParams.sortSelected);
          params = params.append("pageIndex", shopParams.pageNumber.toString());
          params = params.append("pageSize", shopParams.pageSize.toString());

          return this.http.get<IPagination>(configuration.apiUrl + 'crypto', {observe: 'response', params}).pipe(map(r => r.body));
        },
        shopParams,
        true
      ))
    ).subscribe(() => {
    }, error => {
      console.log(error);
    });
  }

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    super();
  }

  getProduct(id: number) {
    return this.getCachedProduct(
      (id: number) => {
        return this.http.get<IProduct>(`${configuration.apiUrl}crypto/${id}`);
      },
      id
    );
  }



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

  getCurrentAccount(): string {
    return this.accountSource.value;
  }

  async fetchEthereumAddress(): Promise<void> {
    if(!this.verifyMetamaskExtension()) return;

    try {
      const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
      const account = ethers.utils.getAddress(accounts[0]);
      this.accountSource.next(account);
    }
    catch {
      this.toastrService.warning("Please login to metamask");
    }
  }

  loadDappazonContract(reload: boolean): Observable<DappazonProvider> {
    return of(this.dappazon).pipe(
      tap(() => {
        this.fetchEthereumAddress();
      }),
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
}
