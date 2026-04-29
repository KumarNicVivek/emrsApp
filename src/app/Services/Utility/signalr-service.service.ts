import { Injectable } from '@angular/core';
import  * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrServiceService {

  private hubConnection!: signalR.HubConnection;
  private isConnected: boolean = false;
  constructor() { }

  startConnection() {

    if (this.isConnected) {
      console.log('SignalR connection already established.');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5100/visitorHub', {
        withCredentials:true //
      }) // Update with your SignalR hub URL
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        this.isConnected = true;
        console.log('SignalR Connection Started');
      }).catch(err => console.log('Error while starting SignalR connection: ' + err));
  }

  onVisitorUpdate(callback: (visitorCount: number) => void) {
    if(!this.hubConnection) {
      console.error('SignalR connection not established. Call startConnection() first.');
      return;
    }

     // ✅ prevent duplicate listeners and remove old listener if exists
    this.hubConnection.off('ReceiveVisitorCount');

    this.hubConnection.on('ReceiveVisitorCount', callback);
  }


}
