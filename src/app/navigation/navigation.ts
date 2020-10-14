import { FuseNavigation } from '@fuse/types';
let lang = localStorage.getItem('language');
let data = [];
// window.location.reload();
if(lang == 'en' || 'es'){
   data = [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      icon: 'home',
      url: '/main/home',
    },
    {
      id: 'calendar',
      title: 'Calendar',
      type: 'item',
      icon: 'date_range',
      url: '/main/calendar',
    }, {
      id: 'sales',
      title: 'Sales',
      type: 'item',
      icon: 'account_balance',
      url: '/main/sales',
    }, {
      id: 'clients',
      title: 'Clients',
      type: 'item',
      icon: 'business_center',
      url: '/main/clients',
    },
    // {
    //   id: 'messages',
    //   title: 'Reviews',
    //   type: 'item',
    //   icon: 'message',
    //   url: '/main/reviews',
    // }, 
    {
      id: 'staff',
      title: 'Staff',
      type: 'item',
      icon: 'event_seat',
      url: '/main/staff',
    }, {
      id: 'services',
      title: 'Services',
      type: 'item',
      icon: 'layers',
      url: '/main/services',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      icon: 'line_weight',
      url: '/main/inventory',
    }, 
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      icon: 'graphic_eq',
      url: '/main/analytics',
    },
    //  {
    //     id: 'onlinebooking',
    //     title: 'Online Booking',
    //     type: 'item',
    //     icon: 'cloud_download',
    //     url: '/main/onlinebooking',
    // },
    {
      id: 'setup',
      title: 'Setup',
      type: 'item',
      icon: 'settings',
      url: '/main/setup',
    },
    // {
    //     id: 'privacy',
    //     title: 'Privacy & Policy',
    //     type: 'item',
    //     icon: 'settings',
    //     url: '/main/privacy',
    // }
  ]
}

//!CHINESE
// 'Home' : '家',
// 'Calendar' : '日曆',
// 'Sales' : '銷售量',
// 'Staff': '員工',
// 'Clients' : '客戶',
// 'Services' : '服務',
// 'Analytics' : '分析',
// 'Setup' : '設定',


if(lang == 'zh'){
  data = [
    {
      id: 'home',
      title: '家',
      type: 'item',
      icon: 'home',
      url: '/main/home',
    },
    {
      id: 'calendar',
      title: '日曆',
      type: 'item',
      icon: 'date_range',
      url: '/main/calendar',
    }, {
      id: 'sales',
      title: '銷售量',
      type: 'item',
      icon: 'account_balance',
      url: '/main/sales',
    }, {
      id: 'clients',
      title: '客戶',
      type: 'item',
      icon: 'business_center',
      url: '/main/clients',
    },
    // {
    //   id: 'messages',
    //   title: 'Reviews',
    //   type: 'item',
    //   icon: 'message',
    //   url: '/main/reviews',
    // }, 
    {
      id: 'staff',
      title: '員工',
      type: 'item',
      icon: 'event_seat',
      url: '/main/staff',
    }, {
      id: 'services',
      title: '服務',
      type: 'item',
      icon: 'layers',
      url: '/main/services',
    },
    // {
    //   id: 'inventory',
    //   title: 'Inventory',
    //   type: 'item',
    //   icon: 'line_weight',
    //   url: '/main/inventory',
    // }, 
    {
      id: 'analytics',
      title: '分析',
      type: 'item',
      icon: 'graphic_eq',
      url: '/main/analytics',
    },
    //  {
    //     id: 'onlinebooking',
    //     title: 'Online Booking',
    //     type: 'item',
    //     icon: 'cloud_download',
    //     url: '/main/onlinebooking',
    // },
    {
      id: 'setup',
      title: '設定',
      type: 'item',
      icon: 'settings',
      url: '/main/setup',
    },
    // {
    //     id: 'privacy',
    //     title: 'Privacy & Policy',
    //     type: 'item',
    //     icon: 'settings',
    //     url: '/main/privacy',
    // }
  ]

}


// //!MANDARIN
// // 'Home' : '家',
// // 'Calendar' : '日历',
// // 'Sales' : '销售量',
// // 'Staff' : '员工',
// // 'Clients' : '客户',
// // 'Services' : '服务',
// // 'Analytics' : '分析',
// // 'Setup' : '设定',

if(lang == 'zh-hans'){
  data = [
    {
      id: 'home',
      title: '家',
      type: 'item',
      icon: 'home',
      url: '/main/home',
    },
    {
      id: 'calendar',
      title: '日历',
      type: 'item',
      icon: 'date_range',
      url: '/main/calendar',
    }, {
      id: 'sales',
      title: '销售量',
      type: 'item',
      icon: 'account_balance',
      url: '/main/sales',
    }, {
      id: 'clients',
      title: '客户',
      type: 'item',
      icon: 'business_center',
      url: '/main/clients',
    },
    // {
    //   id: 'messages',
    //   title: 'Reviews',
    //   type: 'item',
    //   icon: 'message',
    //   url: '/main/reviews',
    // }, 
    {
      id: 'staff',
      title: '员工',
      type: 'item',
      icon: 'event_seat',
      url: '/main/staff',
    }, {
      id: 'services',
      title: '服务',
      type: 'item',
      icon: 'layers',
      url: '/main/services',
    },
    // {
    //   id: 'inventory',
    //   title: 'Inventory',
    //   type: 'item',
    //   icon: 'line_weight',
    //   url: '/main/inventory',
    // }, 
    {
      id: 'analytics',
      title: '分析',
      type: 'item',
      icon: 'graphic_eq',
      url: '/main/analytics',
    },
    //  {
    //     id: 'onlinebooking',
    //     title: 'Online Booking',
    //     type: 'item',
    //     icon: 'cloud_download',
    //     url: '/main/onlinebooking',
    // },
    {
      id: 'setup',
      title: '设定',
      type: 'item',
      icon: 'settings',
      url: '/main/setup',
    },
    // {
    //     id: 'privacy',
    //     title: 'Privacy & Policy',
    //     type: 'item',
    //     icon: 'settings',
    //     url: '/main/privacy',
    // }
  ]

}

export const navigation: FuseNavigation[] = data;