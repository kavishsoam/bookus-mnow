import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { Router } from "@angular/router";
import { ConnectionService } from "ng-connection-service";
import { navigation } from "app/navigation/navigation";
import { SwPush } from "@angular/service-worker";
import { WebNotificationService } from "./web-notification.service";
import { ApiService } from "app/services/api.service";
import { REQUESTAPPT } from "app/services/url";
@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  navigate: boolean = false;
  navRoute: any;
  subscription: Subscription;
  getPage: any;
  page: any;
  anchorPage: any;
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];
  status = "ONLINE";
  isConnected = true;
  notifiy: any = [];
  dates: any = new Date();
  // Private
  private _unsubscribeAll: Subject<any>;
  supportedLangs = [];
  translatedText: any;
  profileData: string;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {TranslateService} _translateService
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _translateService: TranslateService,
    private router: Router,
    private connectionService: ConnectionService,
    private swPush: SwPush,
    private webNotificationService: WebNotificationService,
    private _translate: TranslateService,
    private _service: ApiService
  ) {
    this.getAllNotifications();
    this._service.sendProfileData.subscribe((res) => {
      console.log(res);
      this.profileData = res["firstName"] + " " + res["lastName"];
    });
    this.subscription = this._fuseConfigService
      .getPageHeader()
      .subscribe((message) => {
        this.setPage(message);
      });
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      } else {
        this.status = "OFFLINE";
      }
    });
    // this.page = this._fuseConfigService.pageHeader
    // Set the defaults
    this.userStatusOptions = [
      {
        title: "Online",
        icon: "icon-checkbox-marked-circle",
        color: "#4CAF50",
      },
      {
        title: "Away",
        icon: "icon-clock",
        color: "#FFC107",
      },
      {
        title: "Do not Disturb",
        icon: "icon-minus-circle",
        color: "#F44336",
      },
      {
        title: "Invisible",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#BDBDBD",
      },
      {
        title: "Offline",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#616161",
      },
    ];
    this.languages = [
      {
        id: "en",
        title: "English",
        flag: "us",
      },
      {
        id: "tr",
        title: "Turkish",
        flag: "tr",
      },
    ];
    this.navigation = navigation;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    let fn = localStorage.getItem("firstName");
    let ln = localStorage.getItem("lastName");
    this.profileData = fn + " " + ln;
    // standing data
    this.supportedLangs = [
      { display: "English", value: "en" },
      { display: "Chinese", value: "zh" },
      { display: "Mandarin", value: "zh-hans" },
    ];

    // set current langage
    // this.selectLang('en');

    // Subscribe to the config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === "top";
        this.rightNavbar = settings.layout.navbar.position === "right";
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    // to call the notification.
    let isNotificationEnable = JSON.parse(
      localStorage.getItem("isNotificationEnable")
    );
    if (!isNotificationEnable) {
      setTimeout(() => {
        this.notification();
      }, 5000);
    }
  }

  isCurrentLang(lang: string) {
    // check if the selected lang is current lang
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    // set current lang;
    localStorage.setItem("language", lang);
    this._translate.use(lang);
    this.refreshText();
    window.location.reload();
  }

  refreshText() {
    // refresh translation when language change
    this.translatedText = this._translate.instant("hello world");
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  setPage(message) {
    this.page = message.header;
    this.anchorPage = message.main;
    this.navigate = message.navigate;
    this.cdr.detectChanges();
  }
  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
  }
  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;
    // Use the selected language for translations
    this._translateService.use(lang.id);
  }
  breadcrumb(e) {
    if (this.page == " Client Profile") {
      this.router.navigate((this.navRoute = ["main/clients"]));
    } else {
      this.router.navigate((this.navRoute = ["main/setup"]));
    }
  }
  logout() {
    localStorage.clear();
  }
  //to active the push notification event
  notification() {
    this.webNotificationService.subscribeToNotification();
    localStorage.setItem("isNotificationEnable", "true");
  }

  languageChange() {
    console.log("language change");
    // this.googleTranslateElementInit();
  }

  getAllNotifications() {
    let ownerId: any;
    ownerId = localStorage.getItem("id");
    // this.dataSource = new MatTableDataSource(this.reviewsList);
    this._service.get(REQUESTAPPT + ownerId).subscribe(
      (res) => {
        this.notifiy = res["result"];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // googleTranslateElementInit() {
  // new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
  //
}
