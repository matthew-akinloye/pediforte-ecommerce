import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { Observable } from 'rxjs';
import { User } from '../../user';
import { AuthService } from '../../services/auth/auth.service';
import { tap, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users$: Observable<User[]> | undefined;
  filteredUsers: User[] = [];
  orders$: Observable<any[]> | undefined;
  payments$: Observable<any[]> | undefined;
  selectedUserId: string | null = null;
  currentUserId: string | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  noResults: boolean = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Start loading
    this.users$ = this.adminService.getUsers().pipe(
      tap(users => {
        this.filteredUsers = users;
        this.noResults = this.filteredUsers.length === 0;
        this.isLoading = false; // Stop loading after fetching users
      })
    );
  
    this.payments$ = this.adminService.getPaymentHistory();
  
    this.authService.user$.pipe(
      tap(user => {
        console.log('Current user UID:', user?.uid);
        this.currentUserId = user?.uid || null;
      })
    ).subscribe(); // Subscribe to avoid observable not firing
  }
  

  private loadUsers(): void {
    this.isLoading = true;
    this.users$ = this.adminService.getUsers().pipe(
      tap(users => {
        this.filteredUsers = users;
        this.noResults = this.filteredUsers.length === 0;
        this.isLoading = false; // Stop loading when users are loaded
      })
    );
  }

  private loadPayments(): void {
    this.payments$ = this.adminService.getPaymentHistory();
  }

  private getCurrentUserId(): void {
    this.authService.user$.pipe(
      tap(user => {
        console.log('Current user UID:', user?.uid);
        this.currentUserId = user?.uid || null;
      })
    ).subscribe();
  }

  blockUser(userId: string): void {
    this.adminService.blockUser(userId).then(() => {
      console.log(`User ${userId} blocked.`);
    }).catch(error => {
      console.error('Error blocking user:', error);
    });
  }

  banUser(userId: string): void {
    this.adminService.banUser(userId).then(() => {
      console.log(`User ${userId} banned.`);
    }).catch(error => {
      console.error('Error banning user:', error);
    });
  }

  deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).then(() => {
      console.log(`User ${userId} deleted.`);
    }).catch(error => {
      console.error('Error deleting user:', error);
    });
  }

  loadOrders(userId: string): void {
    this.selectedUserId = userId;
    if (userId) {
      this.orders$ = this.adminService.getOrderHistory(userId);
    }
  }

  searchUsers(): void {
    this.isLoading = true; // Show loader during search
  
    if (this.searchTerm) {
      this.users$?.pipe(
        tap(users => {
          this.filteredUsers = users.filter(user =>
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            (user.firstName + ' ' + user.lastName).toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.noResults = this.filteredUsers.length === 0;
        }),
        // Ensure we end loading state after filtering
        tap(() => this.isLoading = false)
      ).subscribe();
    } else {
      this.users$?.pipe(
        tap(users => {
          this.filteredUsers = users;
          this.noResults = false;
        }),
        tap(() => this.isLoading = false) // Ensure loading state is updated
      ).subscribe();
    }
  }
  
  exportUsers(): void {
    // Implement export functionality here
    console.log('Export Users');
  }

  exportPayments(): void {
    // Implement export functionality here
    console.log('Export Payments');
  }
}
