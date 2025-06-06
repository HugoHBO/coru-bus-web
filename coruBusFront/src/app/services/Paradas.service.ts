import { Injectable } from '@angular/core';
import { Linea, Ruta } from '../models/linea';
import { Parada, ParadaInfo } from '../models/paradas';
import { DataService } from './Data.service';
import { Observable } from 'rxjs';
import { compileFactoryFunction } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class ParadasService {
  constructor(private _DataService: DataService) {}

  setSelectedLinea(linea: any) {
    sessionStorage.setItem('SelectedLinea', JSON.stringify(linea));
  }

  /** devuelve la linea seleccionada º*/
  public getSelectedLinea(): any {
    const guardada = sessionStorage.getItem('SelectedLinea');
    if (guardada) {
      return JSON.parse(guardada);
    }
    return null;
  }
  /** Devuelve todas las paradas */
  public getParadas(): Parada[] | null {
    const guardada = sessionStorage.getItem('paradasData');
    if (!guardada) {
      return null;
    }
    return JSON.parse(guardada);
  }

  /** devuulve las lienas */
  public getLineas(): Linea[] | null {
    const guardada = sessionStorage.getItem('lineasData');
    if (!guardada) {
      return null;
    }
    return JSON.parse(guardada);
  }

  /** devuelve todas las paradas de vuelta  */
  public getParadasIda(selectedLinea: Linea): any {
    const paradas: Parada[] | null = this.getParadas();
    const rutaIda: Ruta | undefined = selectedLinea.rutas.find(
      (r) => r.ruta % 2 === 0
    );

    if (!paradas || !rutaIda) return [];

    const paradasIda = rutaIda?.paradas
      .map((p) => {
        return paradas.find((parada) => parada.id === p);
      })
      .filter((parada): parada is Parada => parada !== undefined);

    return paradasIda;
  }

  /**  devuelve todas las paradas de vuelta */
  public getParadasVuelta(selectedLinea: Linea): any {
    const paradas: Parada[] | null = this.getParadas();
    const rutaVuelta: Ruta | undefined = selectedLinea.rutas.find(
      (r) => r.ruta % 2 !== 0
    );

    if (!paradas || !rutaVuelta) return [];

    const paradasVuelta = rutaVuelta?.paradas
      .map((p) => {
        return paradas.find((parada) => parada.id === p);
      })
      .filter((parada): parada is Parada => parada !== undefined);

    return paradasVuelta;
  }

  /** Devuelve los datos de la parada, en tiempo real */
  public getDatosPadada(idParada: number): Observable<ParadaInfo> {
    return this._DataService.getDatosParada(idParada);
  }

  /** Busca y devuelve el nombre de linea, mediante el numero de enlace de una parada */
  public getCodigoLinea(enlace: number): string | null {
    const lineas: Linea[] | null = this.getLineas();
    const codigoLinea = new Map<number, string>();
    lineas?.forEach((linea) => {
      codigoLinea.set(linea.id, linea.lin_comer);
    });
    const code = codigoLinea.get(enlace);
    if (!code) {
      return null;
    }
    return code;
  }

  /** devuelve el color de la linea por su id */
  public getColorLineaById(idLinea: number): string | null {
    const lineas: Linea[] | null = this.getLineas();
    let linea: Linea | undefined;
    if (lineas) {
      linea = lineas.find((linea) => linea.id === idLinea);
    }
    if (!linea) {
      return null;
    }
    return linea.color;
  }

  /** Devuelve la parada por su id */
  public getParadaById(number: number): Parada | null {
    const paradas: Parada[] | null = this.getParadas();
    let parada: Parada | undefined;
    if (paradas) {
      parada = paradas.find((parada) => parada.id === number);
    }
    if (!parada) {
      return null;
    }
    return parada;
  }
}
