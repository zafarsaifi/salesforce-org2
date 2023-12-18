import { LightningElement, api, track } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class LWCPlatformEvent extends LightningElement {
    @track status;
    @track message;
    @track recordId;
 
    subscription = {};
    @api channelName = '/event/Techdicer_Event__e';
 
    connectedCallback() {
        //Register error listener     
        this.registerErrorListener();
        this.handleSubscribe();
    }
 
    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const self = this;
        const messageCallback = function (response) {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            var obj = JSON.parse(JSON.stringify(response));
            console.log(obj.data.payload);
            console.log(obj.data.payload.message__c);
            console.log(self.channelName);
            let objData = obj.data.payload;
            self.message = objData.message__c;
            self.status = objData.status__c;
            self.recordId = objData.recordId__c;
            self.ShowToast('Techdicer Plaform Event', self.message, 'success', 'dismissable');
        };
 
       
        subscribe(this.channelName, -1, messageCallback).then(response => {
            
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }
 
    //handle Error
    registerErrorListener() {
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
        });
    }
 
    ShowToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
}