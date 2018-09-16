import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  public billList: AngularFirestoreCollection<any>;
  public userId: string;
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      this.billList = this.firestore.collection(`/userProfile/${user.uid}/billList`);
    });
  }

  getBillList(): AngularFirestoreCollection<any> {
    return this.billList;
  }

  getBill(billId: string): AngularFirestoreDocument<any> {
    return this.firestore.doc(`/userProfile/${this.userId}/billList/${billId}`);
  }

  async createBill(
    name: string,
    amount: number,
    dueDate: any = null,
    paid: boolean = false
  ): Promise<any> {
    const newBillRef: firebase.firestore.DocumentReference = await this.billList.add({});

    return newBillRef.update({
      name,
      amount,
      dueDate: `${dueDate.year.value}-${dueDate.month.value - 1}-${dueDate.day.value}`,
      paid,
      id: newBillRef.id,
    });
  }

  removeBill(billId: string): Promise<any> {
    return this.billList.doc(billId).delete();
  }

  payBill(billId: string): Promise<any> {
    return this.billList.doc(billId).update({ paid: true });
  }
}
