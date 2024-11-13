import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SuperAdminGuard } from './super-admin.guard';
import { of, throwError } from 'rxjs';


describe('SuperAdminGuard', () => {
  let guard: SuperAdminGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAngularFireAuth: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(() => {
    // Membuat mock untuk Router dan AngularFireAuth
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAngularFireAuth = jasmine.createSpyObj('AngularFireAuth', ['currentUser']);

    TestBed.configureTestingModule({
      providers: [
        SuperAdminGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth }
      ]
    });

    // Membuat instance dari SuperAdminGuard
    guard = TestBed.inject(SuperAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the user is a superadmin', async () => {
    mockAngularFireAuth.currentUser = Promise.resolve({ email: 'superadmin@example.com' } as any);

    const result = await guard.canActivate(null as any, null as any);
    expect(result).toBeTrue();
  });

  it('should redirect to login if the user is not a superadmin', async () => {
    mockAngularFireAuth.currentUser = Promise.resolve({ email: 'user@example.com' } as any);

    const result = await guard.canActivate(null as any, null as any);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login if there is an error getting the current user', async () => {
    mockAngularFireAuth.currentUser = Promise.reject('Error');

    const result = await guard.canActivate(null as any, null as any);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

