
// ##############################
// // // data for populating the calendar in Calendar view
// #############################

var today = new Date();
var y = today.getFullYear();
var m = today.getMonth();
var d = today.getDate();

const events = [
  {
    title: "All Day Event",
    allDay: true,
    start: new Date(y, m, 1),
    end: new Date(y, m, 1),
    color: "default",
  },
  {
    title: "Meeting",
    start: new Date(y, m, d - 1, 10, 30),
    end: new Date(y, m, d - 1, 11, 30),
    allDay: false,
    color: "green",
  },
  {
    title: "Lunch",
    start: new Date(y, m, d + 7, 12, 0),
    end: new Date(y, m, d + 7, 14, 0),
    allDay: false,
    color: "red",
  },
  {
    title: "Nud-pro Launch",
    start: new Date(y, m, d - 2),
    end: new Date(y, m, d - 2),
    allDay: true,
    color: "azure",
  },
  {
    title: "Birthday Party",
    start: new Date(y, m, d + 1, 19, 0),
    end: new Date(y, m, d + 1, 22, 30),
    allDay: false,
    color: "azure",
  },
  {
    title: "Click for Creative Tim",
    start: new Date(y, m, 21),
    end: new Date(y, m, 22),
    color: "orange",
  },
  {
    title: "Click for Google",
    start: new Date(y, m, 21),
    end: new Date(y, m, 22),
    color: "orange",
  },
];

const JobPostStatusEnglish = ["Deleted", "Pending", "Posted", "Reject", "Expired", "OutOfDate", "Cancel",  "Approved",];
const JobPostStatusVN = ["Đã xóa", "Chờ duyệt", "Đang đăng tải", "Bị từ chối", "Hết hạn", "Quá hạn", "Đã hủy", "Đã duyệt"];

const JobPostStatusVNCombobox = [
  { value: -1, label: "Tất cả"},
  { value: 0, label: "Hủy bỏ"},
  { value: 1, label: "Chờ duyệt"},
  { value: 2, label: "Đang đăng tải"},
  { value: 3, label: "Bị từ chối"},
  { value: 4, label: "Hết hạn"},
  { value: 5, label: "Quá hạn"},
  { value: 6, label: "Đã hủy"},
  { value: 7, label: "Đã duyệt"},
];

const JobPostStatus = {
  deleted : 0,
  pending: 1,
  posted: 2,
  reject: 3,
  expired: 4,
  outOfDate: 5,
  cancel: 6,
  approved: 7,

}

const jobType = {
  PayPerHourJob: 'Làm công',
  PayPerTaskJob: 'Làm khoán'
}

const roleId = {
  admin: 1,
  moderator: 2,
  landowner: 3,
  farmer: 4,
}

const roleNameVN = ["Khác","Quản trị viên","Người điều hành","Chủ đất","Nông dân"]

const gender = ["Nam", "Nữ", "Khác"];

const reportStatus = ["Đã xóa", "Chờ xử lí", "Đã xử lí"];

const treeTypeVNStatus = ["Ẩn","Hoạt động"];


const baseAURL = "http://api.myray.site/api/v1";

export {
  baseAURL, 
  events,
  JobPostStatusEnglish,
  JobPostStatusVN,
  jobType,
  roleId,
  JobPostStatusVNCombobox,
  JobPostStatus,
  gender,
  roleNameVN,
  reportStatus,
  treeTypeVNStatus,
};
