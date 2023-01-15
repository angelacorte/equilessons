import { Injectable } from '@angular/core';
import { BASE_URL } from 'app/_utils/Global';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socket: Socket;

  constructor(private tokenStorage: TokenStorageService) {
    const DOMAIN = BASE_URL

    this.socket = io(DOMAIN);

    this.socket.on('connect', ()=>{
      console.log("Connected to server socket")
    })

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    this.socket.on('disconnect', (reason)=>{
      console.log(`socket ${this.socket.id} disconnected from server because of reason: ${reason}`)
    })

    this.socket.on('ask-to-save-info', ()=>{
      const isClub = this.tokenStorage.isClub()
      const isLoggedIn = !!this.tokenStorage.getToken();
      if(isLoggedIn) {
        const userId = this.tokenStorage.getInfos(isClub)._id
        this.socket.emit('save-client-info', userId)
      }
    })
  }

  eventObservable(event: string): Observable<any> {
    return new Observable((subscribe)=>{
      this.socket.on(event, (data)=>{
        console.log(`on event: ${event}`)
        subscribe.next(data)
      })
    })
  }
}
