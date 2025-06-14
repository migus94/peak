import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product } from "../../../core/interfaces/product.interface";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    
    private readonly apiBase = '/api';
    private productsRoute = '/products';

    readonly products = toSignal(
        this.http.get<Product[]>(`${this.apiBase}${this.productsRoute}`)
            .pipe( map(res => res), catchError(() => of([]))),
            {initialValue: []}
    );


    getProductById(id: number) {
        return toSignal(
            this.http.get<Product>(`${this.apiBase}${this.productsRoute}/${id}`)
                .pipe( map(res => res), catchError(() => of(null))),
                {initialValue: null}
        );
    }
}