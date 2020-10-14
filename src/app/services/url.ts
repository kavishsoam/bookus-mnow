export const REGISTER: string = `users/register`;
export const LOGIN: string = `users/login`;
export const FORGETPASS: string = `users/forgetpass`;
export const RESETPASS: string = `users/resetpass`;

//for client operation
export const CLIENT: string = "client";
export const CLIENT_INFO: string = `appointment/client?id=`;
//for intake form
export const INTAKE: string = "intake";

//for customer
export const CUSTOMER: string = "customers";

//for Service operation
export const SERVICE: string = `services`;
export const SERVICE_GROUP: string = "services/group";
export const SERVICE_GP: string = `services?list=false&group=true`;
export const SERVICE_GP_UPDATE: string = `services/group/`;
export const SERVICE_GP_DEL: string = `services?group=`;

//for staff operation
export const CREATE_STAFF: string = `users/staff`;
export const STAFF: string = `users`;
export const DEACT_STAFF: string = "users/";
export const GET_STAFF_DROP: string = `users?list=true&type=staff`;
export const STAFF_LIST_LOC: string = `users?list=true&type=staff&location_id=`;
export const INACTIVE_STAFF: string = "jobs/inactive_permanent?ownerId=";
//for appointment
export const APPOINTMENT: string = `appointment`;
export const GET_APP: string = `appointment/avail`;
//get owner info
export const MYSETTINGS: string = "users";
export const PROFILE: string = "users/profile";

//get all staff work schedule
export const WORK_SCH: string = `schedule/all?start_date=`;
export const WORK_SCH_BY_STAFF_ID = `schedule?start_date=2018-12-23&end_date=2019-12-29&id=`;
//for loactions
export const LOCATION: string = "location";
export const LOC_LIS: string = `location?list=true&booking=true`;
export const LOCLIST: string = `location?list=true`;
//schedule
export const SCHEDULE_SET: string = `schedule/`;
//for company details
export const COMPANY_DETAILS: string = "company";
//for calendar settings
export const CALENDAR_SETTINGS: string = "company/calendar";
//for changing appointment status
export const APPOINTMENT_STATUS: string = `appointment/`;
//sale
export const SALE: string = `sales`;

//to fetch schedule of staff for a particular date
export const STAFF_SCH: string = `schedule?date=`;
//get invoice
export const INVOICE: string = "invoice";

//for getting tax info
export const TAX: string = `company/tax_rates`;
//for payment
export const DEFAULT_TAX: string = `company/location_taxes`;
export const TAX_CALCULATION: string = `company/tax_calculation`;
export const SETUP: string = `company/setup/`;
///FOR GETTING ALL VOUCHERS
export const VOUCHER: string = "voucher";

//FOR THE stampSettings
export const STAMP: string = `company/setup/stampSettings`;
export const COMP: string = `company/setup/stampSettings`;
export const SETT: string = `company/setup/`;
export const SALEREP: String = `sales/reports`;

//FOR THE TAX CALCULATION
export const TAX_CAL: string = `sales/total_amount?location=`;

//for jobs
export const JOB_LIST: string = "jobs/all_jobs?ownerId=";
export const JOB_APP_OWN: string = "jobs/applier?ownerId=";
export const JOB_ID: string = "&jobId=";
export const DEL_JOB: string = "jobs/delete_job?jobId=";
export const HIRE: string = "jobs/hiring";
export const REHIRE: string = "jobs/rehiring?jobId=";

//freelacers
export const FREE_LANC: string = "jobs/inactive_freelancer?ownerId=";
export const ACTIVE: string = "&inactive=false";
export const INACTIVE: string = "&inactive=true";
export const INVITE_FREE: string = "jobs/invite_freelancer/";

//Cash drawer

export const CASH_DRAW: string = "cashDrawer/cash_post?date=";
export const CASH_DRAW_PUT: string = "cashDrawer/cash_update";
export const CASH_GET: string = "cashDrawer/cash_get?date=";

//Blog

export const POST_BLOG: string = "blogs/blog_post";
export const BLOG_LIST: string = "blogs/blog_view?locationId=";
export const UPDATE_BLOG: string = "blogs/blog_update?blogId=";

//review

export const REVIEW_POST: string = "rating/review";
export const ALLREVIEW: string = "rating/all_review";

//BRAND
export const BRAND: string = "inventory/brands";
//get - brand list
//post - brand create
//get - brand data
// put - update a particular brand
// delete - delete a particular brand

// PRODUCT
//FOR THE PRODUCT
export const PRODUCT: string = `inventory/products`;
//post - create
//get - list
//get  with id
//delete

//FOR THE SUPPLIER
export const SUPPLIER: string = `inventory/suppliers`;
//post - create
//get - list
//get  with id
//delete

//FOR THE SUPPLIER
export const ORDER: string = `inventory/orders`;
//post - create
//get - list
//get  with id
//delete

//CUSTOMIZE

export const INVENTORY: string = `inventory/`;

//requested appointments

export const REQUESTAPPT: string = `request/get_request?ownerId=`;

export const TIME_SLOT: string = `users/slots?service_time=`;

//check intake form of client

export const INTAKE_DATA: string = `users/clientIntake?client=`;

//Business Sale

export const SALE_BUSINESS: string = `company/sale_business`;

export const INVOICE_EDIT: string = `sales/invoice_generate`;
