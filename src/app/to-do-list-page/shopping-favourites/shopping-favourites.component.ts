import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'shopping-favourites',
  templateUrl: './shopping-favourites.component.html',
  styleUrls: ['./shopping-favourites.component.css']
})
export class ShoppingFavouritesComponent {
  items: string[] = [
    'Äpfel',
    'Aufbackbrötchen',
    'Bananen',
    'Brot',
    'Brotaufstrich',
    'Klopapier',
    'Margarine',
    'Milch',
    'Mineralwasser',
    'Pfandflaschen zurückgeben',
    'Shampoo',
    'Sojajoghurt'
  ];
  selectedItems: string[] = [];

  constructor(private dialogRef: MatDialogRef<ShoppingFavouritesComponent>) {
  }

  onClickItem(clickedItem: string): void {
    if (this.itemIsSelected(clickedItem)) {
      this.selectedItems = this.selectedItems.filter(item => item !== clickedItem);
    } else {
      this.selectedItems.push(clickedItem);
    }
  }

  styleSelectedItems(item: string) {
    return this.itemIsSelected(item) ? 'selected-item' : '';
  }

  itemIsSelected(item: string) {
    return this.selectedItems.includes(item);
  }

  onAddItems(): void {
    const selectedItemsOrdered = this.items.filter(item => this.selectedItems.includes(item));
    this.dialogRef.close(
      selectedItemsOrdered
    );
  }

  onCancel(): void {
    this.dialogRef.close([]);
  }

}
