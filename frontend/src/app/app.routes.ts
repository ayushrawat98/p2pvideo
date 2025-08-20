import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticateService } from './Services/authenticate.service';
import { VideoComponent } from './Components/video/video.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';


export const routes: Routes = [
    {
        path: '',
        component : DashboardComponent
    },
    {
        path : 'video/:VideoId',
        component : VideoComponent
    },
    {
        path : 'user/:UserId',
        loadComponent: () => import('./Components/user/user.component').then(m => m.UserComponent)
    },
    {
        path : 'search/:searchString',
        loadComponent: () => import('./Components/search/search.component').then(m => m.SearchComponent)
    },
    // {
    //     path : 'livestream',
    //     loadComponent: () => import('./Components/livestream/livestream.component').then(m => m.LivestreamComponent)
    // },
    // {
    //     path: 'livechat',
    //     loadComponent: () => import('./Components/livechat/livechat.component').then(m => m.LivechatComponent),
    //     canActivate : [() => {  
    //         if(inject(AuthenticateService).loggedIn()){
    //             return true
    //         }else{
    //             inject(Router).navigateByUrl('/')
    //             return false
    //         } 
    //     }]
    // },
    {
        path : 'profile',
        loadComponent: () => import('./Components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate : [() => {  
            if(inject(AuthenticateService).loggedIn()){
                return true
            }else{
                inject(Router).navigateByUrl('/')
                return false
            } 
        }]
    },
    {
        path : 'admin',
        loadComponent: () => import('./Components/admin/admin.component').then(m => m.AdminComponent),
        canActivate : [() => {
            const auth = inject(AuthenticateService)
            if( auth.loggedIn() && auth.user_data().isAdmin){
                return true
            }else{
                inject(Router).navigateByUrl('/')
                return false
            } 
        }]
    },
    {
        path : 'subscription',
        loadComponent : () => import('./Components/subscription/subscription.component').then(m => m.SubscriptionComponent),
        canActivate : [() => { 
            if(inject(AuthenticateService).loggedIn()){
                return true
            }else{
                inject(Router).navigateByUrl('/')
                return false
            } 
        }]
    },
    {
        path : '**',
        redirectTo : ''
    }
];
