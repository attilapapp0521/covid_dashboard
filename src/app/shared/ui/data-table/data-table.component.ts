// shared/ui/data-table/data-table.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    TitleCasePipe, // Ha használod a template-ben
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any>> implements AfterViewInit, OnChanges {
  @Input({ required: true }) columnKeys!: string[];
  @Input() columnHeaders: Record<string, string> | null = null;
  @Input({ required: true }) data: T[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() defaultPageSize = 10;
  @Input() sortableColumns: string[] | null = null;
  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnKeys']) {
      this.displayedColumns = this.columnKeys ? [...this.columnKeys] : [];
    }
    if (changes['data']) {
      // Új referencia biztosítása a MatTableDataSource-nak, hogy észlelje a változást.
      this.dataSource.data = this.data ? [...this.data] : [];
    }

    if ((changes['pageSizeOptions'] || changes['defaultPageSize']) && this.dataSource.paginator) {
      this.updatePaginatorConfig();
    }
  }

  ngAfterViewInit(): void {
    // Miután a ViewChild elemek elérhetővé válnak, hozzárendeljük őket a dataSource-hoz.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updatePaginatorConfig(); // Biztosítjuk a helyes kezdeti lapméretet
  }

  private updatePaginatorConfig(): void {
    if (this.paginator) {
      this.paginator.pageSizeOptions = this.pageSizeOptions;
      // Ellenőrizzük, hogy az defaultPageSize benne van-e az opciókban
      if (this.pageSizeOptions.includes(this.defaultPageSize)) {
        this.paginator.pageSize = this.defaultPageSize;
      } else if (this.pageSizeOptions.length > 0) {
        this.paginator.pageSize = this.pageSizeOptions[0]; // Vagy az első elérhető opció
      }
      // A MatTableDataSource-nak tudnia kell a paginator változásáról,
      // de a this.dataSource.paginator = this.paginator; hozzárendelés után ez automatikus.
    }
  }

  isColumnSortable(columnKey: string): boolean {
    if (this.sortableColumns === null || this.sortableColumns === undefined) {
      return true; // Ha nincs specifikusan megadva, minden oszlop rendezhető
    }
    return this.sortableColumns.includes(columnKey);
  }

  getHeaderText(columnKey: string): string {
    return this.columnHeaders?.[columnKey] || new TitleCasePipe().transform(columnKey);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Szűrés után ugorjon az első oldalra
    }
  }
}
