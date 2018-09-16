import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { BillService } from '../../services/bill.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.page.html',
  styleUrls: ['./bill-detail.page.scss'],
})
export class BillDetailPage implements OnInit {
  public bill: Observable<any>;
  public billId: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public billService: BillService
  ) {}

  ngOnInit() {
    this.billId = this.route.snapshot.paramMap.get('id');
    this.bill = this.billService.getBill(this.billId).valueChanges();
  }

  async showOptions(): Promise<void> {
    const action = await this.actionCtrl.create({
      header: 'Modify your bill',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.billService.removeBill(this.billId).then(() => {
              this.router.navigateByUrl('home');
            });
          },
        },
        {
          text: 'Mark as Paid!',
          icon: 'checkmark',
          handler: () => {
            this.billService.payBill(this.billId);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    action.present();
  }
}
